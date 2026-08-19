import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { verifyToken } from '@clerk/backend';
import { UserRepository, OrganizationRepository, MemberRepository, EnvironmentRepository } from '@novu/dal';
import { MemberRoleEnum, ApiAuthSchemeEnum, ALL_PERMISSIONS } from '@novu/shared';
import * as fs from 'fs';

const sessionCache = new Map();
const CACHE_TTL_MS = 60 * 1000;

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private userRepository: UserRepository;
  private organizationRepository: OrganizationRepository;
  private memberRepository: MemberRepository;
  private environmentRepository: EnvironmentRepository;

  constructor(private moduleRef: ModuleRef) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.userRepository) {
      this.userRepository = this.moduleRef.get(UserRepository, { strict: false });
      this.organizationRepository = this.moduleRef.get(OrganizationRepository, { strict: false });
      this.memberRepository = this.moduleRef.get(MemberRepository, { strict: false });
      this.environmentRepository = this.moduleRef.get(EnvironmentRepository, { strict: false });
    }
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }
    request.authScheme = 'Bearer';
    const token = authorizationHeader.replace('Bearer ', '').trim();
    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }
    const cached = sessionCache.get(token);
    if (cached && cached.expiresAt > Date.now()) {
      request.user = cached.user;
      return true;
    }
    try {
      console.log('[ClerkAuthGuard] Verifying token...');
      const payload = await verifyToken(token, {
        secretKey: (process.env.CLERK_SECRET_KEY as string) || '',
      });
      console.log('[ClerkAuthGuard] Token verified. sub:', payload.sub);
      const email = (payload.email || payload.primary_email || `${payload.sub}@clerk.local`) as string;
      const firstName = (payload.first_name || payload.firstName || 'User') as string;
      const lastName = (payload.last_name || payload.lastName || '') as string;
      const imageUrl = payload.image_url || payload.imageUrl || '';
      let user = await this.userRepository.findOne({ externalId: payload.sub });
      if (!user) {
        user = await this.userRepository.findByEmail(email);
      }
      if (!user) {
        console.log('[ClerkAuthGuard] Creating new user via JIT provisioning...');
        user = await this.userRepository.create({
          email: email,
          firstName,
          lastName,
          profilePicture: imageUrl,
          externalId: payload.sub,
        });
        try {
          const createOrgUsecase = this.moduleRef.get('CreateOrganizationUsecase', { strict: false }) as any;
          if (createOrgUsecase) {
            await createOrgUsecase.execute({
              name: `${firstName}'s Organization`,
              userId: user._id,
            });
            console.log('[ClerkAuthGuard] JIT provisioning complete using standard flow.');
          } else {
            console.warn('[ClerkAuthGuard] CreateOrganizationUsecase not found! JIT provisioning might be incomplete.');
          }
        } catch (orgErr: any) {
          console.error('[ClerkAuthGuard] Failed to run standard organization creation:', orgErr.message);
        }
      }
      const members = await this.memberRepository.findUserActiveMembers(user._id);
      const activeOrgId = members.length > 0 ? members[0]._organizationId : undefined;

      const environments = activeOrgId ? await this.environmentRepository.findOrganizationEnvironments(activeOrgId) : [];
      const devEnv = environments.find((env) => env.name === 'Development') || environments[0];
      const userRoles = members.length > 0 ? members[0].roles : [MemberRoleEnum.ADMIN];
      request.user = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        organizationId: activeOrgId,
        roles: userRoles,
        permissions: ALL_PERMISSIONS,
        scheme: ApiAuthSchemeEnum.BEARER,
        environmentId: devEnv?._id,
      };
      sessionCache.set(token, {
        user: request.user,
        expiresAt: Date.now() + CACHE_TTL_MS,
      });
      if (sessionCache.size > 1000) {
        const now = Date.now();
        for (const [k, v] of sessionCache.entries()) {
          if (v.expiresAt < now) sessionCache.delete(k);
        }
      }
      console.log('[ClerkAuthGuard] Session attached. orgId:', activeOrgId, 'envId:', devEnv?._id);
      return true;
    } catch (err: any) {
      console.error('[ClerkAuthGuard] Token Verification Failed:', err.message);
      fs.appendFileSync(
        '/home/codespace/clerk-error.log',
        `\n[${new Date().toISOString()}] Error: ${err.message || err}\nStack: ${err.stack}\nCLERK_SECRET_KEY set: ${!!process.env.CLERK_SECRET_KEY}\n---\n`
      );
      throw new UnauthorizedException(`Clerk auth failed: ${err.message || err}`);
    }
  }
}

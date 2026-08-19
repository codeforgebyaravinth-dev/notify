import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { auth } from './better-auth.config';
import { UserRepository, OrganizationRepository, MemberRepository, EnvironmentRepository } from '@novu/dal';
import { MemberRoleEnum, ApiAuthSchemeEnum, ALL_PERMISSIONS } from '@novu/shared';
import * as fs from 'fs';

@Injectable()
export class BetterAuthGuard implements CanActivate {
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

    try {
      const token = authorizationHeader.replace(/^Bearer /i, '').trim();
      
      const internalRepo = (this.userRepository as any).userRepository;
      const db = internalRepo?._model?.db || internalRepo?.MongooseModel?.db;
      
      if (!db) {
        console.error("UserRepository keys:", Object.keys(this.userRepository));
        if (internalRepo) console.error("InternalRepo keys:", Object.keys(internalRepo));
        throw new Error("Could not find db on userRepository");
      }

      console.log("[BetterAuthGuard] Bypassing bug. Checking plain text token in DB:", token);
      const sessionData = await db.collection('session').findOne({ token });
      
      if (!sessionData) {
        throw new UnauthorizedException('Invalid or expired Better Auth session');
      }
      
      const betterAuthUser = await db.collection('user').findOne({ _id: sessionData.userId });
      if (!betterAuthUser) {
        throw new UnauthorizedException('Invalid Better Auth user');
      }
      
      const payload = Object.assign({}, betterAuthUser, { id: betterAuthUser._id });
      const email = payload.email as string;
      const firstName = (payload.name?.split(' ')[0] || 'User') as string;
      const lastName = (payload.name?.split(' ')[1] || '') as string;
      const imageUrl = (payload.image || '') as string;

      let user = await this.userRepository.findOne({ externalId: payload.id });

      if (!user) {
        user = await this.userRepository.findByEmail(email);
      }

      if (!user) {
        console.log('[BetterAuthGuard] Creating new user via JIT provisioning...');
        user = await this.userRepository.create({
          email: email,
          firstName,
          lastName,
          profilePicture: imageUrl,
          externalId: payload.id,
        });

        try {
          const createOrgUsecase = this.moduleRef.get('CreateOrganizationUsecase', { strict: false }) as any;
          if (createOrgUsecase) {
            await createOrgUsecase.execute({
              name: `${firstName}'s Organization`,
              userId: user._id,
            });
            console.log('[BetterAuthGuard] JIT provisioning complete using standard flow.');
          }
        } catch (orgErr: any) {
          console.error('[BetterAuthGuard] Failed to run standard organization creation:', orgErr.message);
        }
      }

      const members = await this.memberRepository.findUserActiveMembers(user._id);
      
      const headerOrgId = request.headers['novu-organization-id'] || request.headers['Novu-Organization-Id'];
      let activeOrgId = undefined;
      
      if (headerOrgId && members.some(m => m._organizationId === headerOrgId)) {
        activeOrgId = headerOrgId;
      }
      
      if (!activeOrgId) {
        activeOrgId = members.length > 0 ? members[0]._organizationId : undefined;
      }

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

      console.log('[BetterAuthGuard] Session attached. orgId:', activeOrgId, 'envId:', devEnv?._id);
      return true;

    } catch (err: any) {
      console.error('[BetterAuthGuard] Token Verification Failed:', err.message);
      fs.appendFileSync(
        '/home/codespace/better-auth-error.log',
        `\n[${new Date().toISOString()}] Error: ${err.message || err}\nStack: ${err.stack}\n---\n`
      );
      throw new UnauthorizedException(`Better Auth verification failed: ${err.message || err}`);
    }
  }
}

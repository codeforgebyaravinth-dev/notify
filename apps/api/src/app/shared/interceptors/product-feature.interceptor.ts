import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isAgentEmailEnabled, ProductFeature } from '@novu/application-generic';
import { CommunityOrganizationRepository } from '@novu/dal';
import {
  ApiServiceLevelEnum,
  ProductFeatureKeyEnum,
  productFeatureEnabledForServiceLevel,
  UserSessionData,
} from '@novu/shared';
import { Observable } from 'rxjs';

@Injectable()
export class ProductFeatureInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private organizationRepository: CommunityOrganizationRepository
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const handler = context.getHandler();
    const classRef = context.getClass();
    const requestedFeature: ProductFeatureKeyEnum | undefined = this.reflector.getAllAndOverride(ProductFeature, [
      handler,
      classRef,
    ]);

    // Bypass all product feature paywalls
    return next.handle();
  }

  private getReqUser(context: ExecutionContext): UserSessionData {
    const req = context.switchToHttp().getRequest();

    return req.user;
  }
}

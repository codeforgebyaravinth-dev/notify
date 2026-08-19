import { MiddlewareConsumer, ModuleMetadata } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PassportStrategyEnum } from '@novu/shared';
import {
  cacheService,
  FeatureFlagsService,
  featureFlagsService,
  InMemoryLRUCacheService,
  PlatformException,
} from '@novu/application-generic';
import { RootEnvironmentGuard } from './framework/root-environment-guard.service';
import { AuthService } from './services/auth.service';
import { CommunityAuthService } from './services/community.auth.service';
import { ApiKeyStrategy } from './services/passport/apikey.strategy';
import { JwtSubscriberStrategy } from './services/passport/subscriber-jwt.strategy';
import { USE_CASES } from './usecases';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { EnvironmentsModuleV1 } from '../environments-v1/environments-v1.module';
import { CommunityMemberRepository, CommunityOrganizationRepository, CommunityUserRepository } from '@novu/dal';

export function getEEModuleConfig(): ModuleMetadata {
  const eeAuthPackage = require('@novu/ee-auth');
  const eeAuthModule = eeAuthPackage?.eeAuthModule;

  if (!eeAuthModule) {
    throw new PlatformException('ee-auth module is not loaded');
  }

  const injectableProviders = [
    {
      provide: 'USER_REPOSITORY',
      useClass: CommunityUserRepository,
    },
    {
      provide: 'ORGANIZATION_REPOSITORY',
      useClass: CommunityOrganizationRepository,
    },
    {
      provide: 'MEMBER_REPOSITORY',
      useClass: CommunityMemberRepository,
    },
    {
      provide: 'AUTH_SERVICE',
      useClass: CommunityAuthService,
    },
  ];

  console.log("EE AUTH MODULE CONTROLLERS:", eeAuthModule.controllers);
    return {
    imports: [
      ...eeAuthModule.imports,
      SharedModule,
      UserModule,
      EnvironmentsModuleV1,
      PassportModule.register({
        defaultStrategy: PassportStrategyEnum.JWT,
      }),
      JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: 360000,
        },
      }),
    ],
    controllers: [...eeAuthModule.controllers],
    providers: [
      ...eeAuthModule.providers,
      ...injectableProviders,
      ...USE_CASES,
      // reused services
      ApiKeyStrategy,
      JwtSubscriberStrategy,
      AuthService,
      cacheService,
      featureFlagsService,
      InMemoryLRUCacheService,
      RootEnvironmentGuard,
    ],
    exports: [
      ...eeAuthModule.exports,
      RootEnvironmentGuard,
      AuthService,
      FeatureFlagsService,
      'AUTH_SERVICE',
      'USER_REPOSITORY',
      'MEMBER_REPOSITORY',
      'ORGANIZATION_REPOSITORY',
    ],
  };
}

export function configure(consumer: MiddlewareConsumer) {
  const eeAuthPackage = require('@novu/ee-auth');

  if (!eeAuthPackage?.configure) {
    throw new PlatformException('ee-auth configure() is not loaded');
  }

  eeAuthPackage.configure(consumer);
}

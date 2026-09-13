import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DeletePreferencesUseCase, GetPreferences, UpsertPreferences } from '@notify/application-generic';
import { PreferencesRepository } from '@notify/dal';
import { SharedModule } from '../shared/shared.module';
import { PreferencesController } from './preferences.controller';

const PROVIDERS = [PreferencesRepository, UpsertPreferences, GetPreferences, DeletePreferencesUseCase];

@Module({
  imports: [SharedModule],
  providers: [...PROVIDERS],
  controllers: [PreferencesController],
  exports: [...PROVIDERS],
})
export class PreferencesModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {}
}

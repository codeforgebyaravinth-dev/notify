import { Injectable, Module } from '@nestjs/common';

@Injectable()
export class Translate {
  async execute(params: any): Promise<string> {
    return params.content;
  }
}

@Module({
  providers: [Translate],
  exports: [Translate],
})
export class TranslationModule {}

@Module({
  imports: [TranslationModule],
  providers: [Translate],
  exports: [Translate, TranslationModule],
})
export class EnterpriseTranslationModule {}

export class PublishTranslationGroup {}
export class DuplicateLocales {}
export class DeleteTranslationGroup {}
export class DiffTranslationGroups {}
export class PromoteTranslationChange {}

import { Injectable } from '@nestjs/common';
import { InstrumentUsecase } from '@notify/application-generic';
import { MessageTemplateRepository } from '@notify/dal';

@Injectable()
export class GetStepResolversCountUsecase {
  constructor(private messageTemplateRepository: MessageTemplateRepository) {}

  @InstrumentUsecase()
  async execute(environmentId: string): Promise<{ count: number }> {
    const count = await this.messageTemplateRepository.count({
      _environmentId: environmentId,
      stepResolverHash: { $exists: true, $nin: [null, ''] },
    });

    return { count };
  }
}

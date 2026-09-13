import { Injectable } from '@nestjs/common';
import {
  CreateExecutionDetails,
  CreateExecutionDetailsCommand,
  DetailEnum,
  InstrumentUsecase,
} from '@notify/application-generic';
import { MessageRepository } from '@notify/dal';
import { ExecutionDetailsSourceEnum, ExecutionDetailsStatusEnum } from '@notify/shared';
import { SendMessageCommand } from './send-message.command';
import { SendMessageResult, SendMessageStatus, SendMessageType } from './send-message-type.usecase';

@Injectable()
export class SendMessageDelay extends SendMessageType {
  constructor(
    protected messageRepository: MessageRepository,
    protected createExecutionDetails: CreateExecutionDetails
  ) {
    super(messageRepository, createExecutionDetails);
  }

  @InstrumentUsecase()
  public async execute(command: SendMessageCommand): Promise<SendMessageResult> {
    await this.createExecutionDetails.execute(
      CreateExecutionDetailsCommand.create({
        ...CreateExecutionDetailsCommand.getDetailsFromJob(command.job),
        detail: DetailEnum.DELAY_FINISHED,
        source: ExecutionDetailsSourceEnum.INTERNAL,
        status: ExecutionDetailsStatusEnum.SUCCESS,
        isTest: false,
        isRetry: false,
      })
    );

    return {
      status: SendMessageStatus.SUCCESS,
    };
  }
}

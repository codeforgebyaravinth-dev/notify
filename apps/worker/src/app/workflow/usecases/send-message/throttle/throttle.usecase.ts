import { Injectable } from '@nestjs/common';
import { CreateExecutionDetails, InstrumentUsecase } from '@notify/application-generic';
import { MessageRepository } from '@notify/dal';
import { SendMessageCommand } from '../send-message.command';
import { SendMessageResult, SendMessageStatus, SendMessageType } from '../send-message-type.usecase';

@Injectable()
export class Throttle extends SendMessageType {
  constructor(
    protected messageRepository: MessageRepository,
    protected createExecutionDetails: CreateExecutionDetails
  ) {
    super(messageRepository, createExecutionDetails);
  }

  @InstrumentUsecase()
  public async execute(command: SendMessageCommand): Promise<SendMessageResult> {
    return {
      status: SendMessageStatus.SUCCESS,
      job: command.job,
    };
  }
}

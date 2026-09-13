import { BaseCommand } from '@notify/application-generic';
import { JobEntity } from '@notify/dal';
import { IsDefined } from 'class-validator';

export class DigestEventsCommand extends BaseCommand {
  @IsDefined()
  _subscriberId: string;

  @IsDefined()
  currentJob: JobEntity;
}

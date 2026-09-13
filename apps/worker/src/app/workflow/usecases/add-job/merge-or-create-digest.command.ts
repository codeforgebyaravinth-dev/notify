import { BaseCommand } from '@notify/application-generic';

import { JobEntity } from '@notify/dal';
import { IsDefined } from 'class-validator';

export class MergeOrCreateDigestCommand extends BaseCommand {
  @IsDefined()
  job: JobEntity;
}

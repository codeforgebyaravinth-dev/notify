import { EnvironmentCommand } from '@notify/application-generic';
// TODO: Implement a DTO or shared entity
import { JobEntity } from '@notify/dal';
import { IsDefined } from 'class-validator';

export class StoreSubscriberJobsCommand extends EnvironmentCommand {
  @IsDefined()
  jobs: Omit<JobEntity, '_id' | 'createdAt' | 'updatedAt'>[];
}

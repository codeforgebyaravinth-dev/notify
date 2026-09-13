import { PaginatedListCommand } from '@notify/application-generic';
import { StepTypeEnum, WorkflowStatusEnum } from '@notify/shared';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class ListWorkflowsCommand extends PaginatedListCommand {
  @IsOptional()
  searchQuery?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsEnum(WorkflowStatusEnum, { each: true })
  status?: WorkflowStatusEnum[];
}

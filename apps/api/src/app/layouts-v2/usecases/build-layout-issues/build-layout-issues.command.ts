import { EnvironmentWithUserCommand, JSONSchemaDto } from '@notify/application-generic';
import { ResourceOriginEnum } from '@notify/shared';
import { IsDefined, IsEnum, IsObject, IsOptional } from 'class-validator';

export class BuildLayoutIssuesCommand extends EnvironmentWithUserCommand {
  @IsDefined()
  @IsEnum(ResourceOriginEnum)
  resourceOrigin: ResourceOriginEnum;

  @IsObject()
  @IsOptional()
  controlValues: Record<string, unknown> | null;

  @IsObject()
  @IsDefined()
  controlSchema: JSONSchemaDto;
}

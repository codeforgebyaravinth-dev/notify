import { CursorBasedPaginatedCommand } from '@notify/application-generic';
import { AgentIntegrationEntity } from '@notify/dal';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ListAgentIntegrationsCommand extends CursorBasedPaginatedCommand<
  AgentIntegrationEntity,
  'createdAt' | 'updatedAt' | '_id'
> {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  environmentId: string;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  organizationId: string;

  @IsString()
  @IsNotEmpty()
  agentIdentifier: string;

  @IsString()
  @IsOptional()
  integrationIdentifier?: string;
}

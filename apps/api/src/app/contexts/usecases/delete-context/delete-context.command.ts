import { ContextType } from '@notify/shared';
import { IsNotEmpty, IsString } from 'class-validator';
import { EnvironmentCommand } from '../../../shared/commands/project.command';

export class DeleteContextCommand extends EnvironmentCommand {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  type: ContextType;
}

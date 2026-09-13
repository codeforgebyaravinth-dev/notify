import { EnvironmentWithUserObjectCommand, PreviewPayloadDto } from '@notify/application-generic';
import { IsObject, IsOptional } from 'class-validator';

export class TestHttpEndpointCommand extends EnvironmentWithUserObjectCommand {
  @IsOptional()
  @IsObject()
  controlValues?: Record<string, unknown>;

  @IsOptional()
  previewPayload?: PreviewPayloadDto;
}

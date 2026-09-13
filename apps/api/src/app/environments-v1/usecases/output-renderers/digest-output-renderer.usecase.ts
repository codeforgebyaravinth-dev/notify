import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InstrumentUsecase } from '@notify/application-generic';
import { DigestRenderOutput } from '@notify/shared';
import { RenderCommand } from './render-command';

@Injectable()
export class DigestOutputRendererUsecase {
  @InstrumentUsecase()
  execute(renderCommand: RenderCommand): DigestRenderOutput {
    const { skip, ...outputControls } = renderCommand.controlValues ?? {};

    return outputControls as any;
  }
}

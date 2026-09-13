import { Injectable } from '@nestjs/common';
import { InstrumentUsecase } from '@notify/application-generic';
import { ToolRenderOutput } from '@notify/shared';

/** Maps already-translated tool controls to the body-only step output. */
@Injectable()
export class ToolOutputRendererUsecase {
  @InstrumentUsecase()
  execute(translatedControls: Record<string, unknown>): ToolRenderOutput {
    return {
      body: (translatedControls.body as string) ?? '',
    };
  }
}

import { All, Controller, Get, Req, Res } from '@nestjs/common';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './better-auth.config';

@Controller('better-auth')
export class BetterAuthController {
  @Get('auth-config')
  async authConfig() {
    return {
      data: {
        emailPasswordAuthEnabled: true,
        ssoEnabled: false, // can be tied to process.env later
      }
    };
  }

  @All('/*')
  async handler(@Req() req: any, @Res() res: any) {
    // NestJS uses Express Router, which strips the base path from req.url.
    // Better Auth expects the full path in req.url to match against its baseURL.
    req.url = req.originalUrl;
    console.log('[BetterAuthController] originalUrl:', req.originalUrl, 'url:', req.url);
    return toNodeHandler(auth)(req, res);
  }
}

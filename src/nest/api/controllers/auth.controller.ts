import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('url')
  getClientUrl(): { url: string } {
    return {
      url: this.authService.getAuthorizeUrl(),
    };
  }

  @Get('callback')
  getCallback(@Query() query, @Res() res): void {
    if (query.state !== 'st1') {
      throw new HttpException('Invalid request', HttpStatus.BAD_REQUEST);
    }

    this.authService
      .handleCallback(query.code)
      .then((accessToken) =>
        res.redirect(`http://localhost:4200/?token=${accessToken}`),
      )
      .catch(() => res.redirect(`http://localhost:4200`));
  }
}

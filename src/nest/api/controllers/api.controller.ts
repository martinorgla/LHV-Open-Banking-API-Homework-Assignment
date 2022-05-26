import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiService } from '../services/api.service';
import { Account } from '../interfaces/account';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('accounts')
  getAccounts(@Query() query): Promise<Account[]> {
    return this.apiService.getAccounts(query.token).catch(() => {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    });
  }
}

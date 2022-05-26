import { Module } from '@nestjs/common';
import { ApiController } from './controllers/api.controller';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { HttpService } from './services/http.service';

@Module({
  imports: [],
  controllers: [ApiController, AuthController],
  providers: [ApiService, AuthService, HttpService],
})
export class ApiModule {}

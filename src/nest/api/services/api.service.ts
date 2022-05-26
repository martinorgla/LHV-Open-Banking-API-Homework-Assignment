import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import axios from 'axios';
import { Account } from '../interfaces/account';

@Injectable()
export class ApiService {
  constructor(
    private authService: AuthService,
    private httpService: HttpService,
  ) {}

  /**
   * Get list of user accounts
   * @param token
   */
  async getAccounts(token: string): Promise<Account[]> {
    const options = this.httpService.getHttpOptions();
    const url = 'https://api.sandbox.lhv.eu/psd2/v1/accounts-list';

    options.headers = {
      Authorization: `Bearer ${token}`,
      'X-Request-ID': token,
    };

    return await axios.get(url, options).then((res) => {
      return res.data;
    });
  }
}

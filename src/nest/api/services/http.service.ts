import { Injectable } from '@nestjs/common';
import * as https from 'https';
import * as fs from 'fs';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class HttpService {

  /**
   * Get HTTP options with custom agent
   * Certificate and key file locations shouldn't be hardcoded
   */
  getHttpOptions(): AxiosRequestConfig<string> {
    const httpsAgent = new https.Agent({
      cert: fs.readFileSync(
        __dirname + '/../../../../certificates/sandbox.crt',
      ),
      key: fs.readFileSync(__dirname + '/../../../../certificates/sandbox.key'),
    });

    return {
      httpsAgent,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
  }
}

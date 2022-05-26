import { Injectable } from '@nestjs/common';
import { X509Certificate } from 'crypto';
import * as fs from 'fs';
import axios from 'axios';
import * as querystring from 'querystring';
import { HttpService } from './http.service';

@Injectable()
export class AuthService {
  private OAuthUrl = 'https://api.sandbox.lhv.eu/psd2/oauth/';

  constructor(private httpService: HttpService) {}

  /**
   * Returns LHV Sandbox API authorization URL
   */
  getAuthorizeUrl(): string {
    const params = new URLSearchParams({
      scope: 'psd2',
      response_type: 'code',
      client_id: this.getOrganizationIdentifier(),
      redirect_uri: 'http://localhost:3000/api/auth/callback',
      state: 'st1',
    });

    return `${this.OAuthUrl}authorize?${params}`;
  }

  /**
   * For production this extraction should happen on the deployment.
   * Extracted organization identifier should be stored in application
   * configuration or as env variable
   */
  getOrganizationIdentifier(): string {
    const cert = new X509Certificate(
      fs.readFileSync(__dirname + '/../../../../certificates/sandbox.crt'),
    );
    const match = cert.subject.match(/^(organizationIdentifier=)(.*)$/m);

    return match[2];
  }

  /**
   * Returns access token
   * @param code
   */
  handleCallback(code: string): Promise<string> {
    const data = {
      client_id: this.getOrganizationIdentifier(),
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'http://localhost:3000/api/auth/callback',
    };

    return new Promise((resolve, reject) => {
      axios
        .post(
          `${this.OAuthUrl}token`,
          querystring.stringify(data),
          this.httpService.getHttpOptions(),
        )
        .then((res) => {
          resolve(res.data?.access_token);
        })
        .catch((err) => reject(err));
    });
  }
}

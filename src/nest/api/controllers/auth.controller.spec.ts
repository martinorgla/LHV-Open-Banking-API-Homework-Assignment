import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Test } from '@nestjs/testing';
import { HttpService } from '../services/http.service';
import { AuthController } from './auth.controller';
import { HttpException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [ApiService, AuthService, HttpService],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  describe('getUrl', () => {
    it('should return client url', () => {
      const result = 'http://www.result.com';
      jest
        .spyOn(authService, 'getAuthorizeUrl')
        .mockImplementation(() => result);

      expect(authController.getClientUrl()).toEqual({ url: result });
    });
  });

  describe('getCallback', () => {
    it('should result valid client url', () => {
      const result = 'mymagictoken';
      jest.spyOn(authService, 'handleCallback').mockImplementation(
        () =>
          new Promise((resolve) => {
            resolve(result);
          }),
      );

      expect(
        authController.getCallback(
          { state: 'st1' },
          {
            redirect: (targetUrl) => {
              expect(targetUrl).toEqual(
                `http://localhost:4200/?token=${result}`,
              );
            },
          },
        ),
      );
    });

    it('should return default redirect url', () => {
      const result = 'http://localhost:4200';
      jest.spyOn(authService, 'handleCallback').mockImplementation(
        () =>
          new Promise((_, reject) => {
            reject();
          }),
      );

      expect(
        authController.getCallback(
          { state: 'st1' },
          {
            redirect: (targetUrl) => {
              expect(targetUrl).toEqual(result);
            },
          },
        ),
      );
    });

    it('should throw HttpException', () => {
      expect(async () => {
        try {
          await authController.getCallback(null, null);
        } catch (e) {
          expect(e).toEqual(HttpException);
        }
      });
    });
  });
});

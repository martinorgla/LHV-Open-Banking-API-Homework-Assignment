import { ApiController } from './api.controller';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Test } from '@nestjs/testing';
import { Account } from '../interfaces/account';
import { HttpService } from '../services/http.service';
import { HttpException } from '@nestjs/common';

describe('ApiController', () => {
  let apiController: ApiController;
  let apiService: ApiService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [ApiService, AuthService, HttpService],
    }).compile();

    apiService = moduleRef.get<ApiService>(ApiService);
    apiController = moduleRef.get<ApiController>(ApiController);
  });

  describe('getAccounts', () => {
    it('should return an array of accounts', async () => {
      const result: Account[] = [
        {
          iban: 'EE957700776002687221',
          currency: 'EUR',
          name: 'Liis-Mari Männik TEST',
          product: 'EUR currency account',
          cashAccountType: 'LLSV',
          status: 'enabled',
        },
      ];

      jest.spyOn(apiService, 'getAccounts').mockImplementation(
        () =>
          new Promise((resolve) => {
            resolve(result);
          }),
      );

      expect(await apiController.getAccounts('7760026')).toBe(result);
    });

    it('should throw HttpException', async () => {
      jest.spyOn(apiService, 'getAccounts').mockImplementation(
        () =>
          new Promise((_, reject) => {
            reject('');
          }),
      );

      expect(async () => {
        try {
          await apiService.getAccounts('dummyToken');
        } catch (e) {
          expect(e).toEqual(HttpException);
        }
      });
    });
  });
});

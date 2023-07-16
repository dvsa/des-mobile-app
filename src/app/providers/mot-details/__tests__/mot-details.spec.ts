import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UrlProvider } from '@providers/url/url';
import { UrlProviderMock } from '@providers/url/__mocks__/url.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import {
  ERROR_MSGS, MotDetailsErr, MotDetailsProvider, motError$,
} from '@providers/mot-details/mot-details';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import { HttpStatusCodes } from '@shared/models/http-status-codes';
import { MotDetails } from '@providers/mot-details/mot-details.model';

describe('MotDetailsProvider', () => {
  let provider: MotDetailsProvider;
  let urlProvider: UrlProvider;
  let httpMock: HttpTestingController;
  let networkStateProvider: NetworkStateProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: NetworkStateProvider,
          useClass: NetworkStateProviderMock,
        },
        {
          provide: UrlProvider,
          useClass: UrlProviderMock,
        },
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    provider = TestBed.inject(MotDetailsProvider);
    urlProvider = TestBed.inject(UrlProvider);
    networkStateProvider = TestBed.inject(NetworkStateProvider);
  });

  describe('getVehicleByIdentifier', () => {
    it('should execute request and return 200', () => {
      spyOn(networkStateProvider, 'getNetworkState')
        .and
        .returnValue(ConnectionStatus.ONLINE);

      // call method
      provider.getVehicleByIdentifier('ABC123')
        .subscribe({
          // expect object response
          next: (value) => expect(value)
            .toEqual({ registration: 'ABC123' } as MotDetails),
        });

      // stub response
      const req = httpMock.expectOne('https://www.example.com/1.0/checkMot?identifier=ABC123');
      req.flush({ registration: 'ABC123' }, {
        status: HttpStatusCodes.OK,
        statusText: 'OK',
      });

      // expect HTTP methods and providers to have been called
      expect(req.request.method)
        .toEqual('GET');
      expect(urlProvider.getTaxMotUrl)
        .toHaveBeenCalled();
    });
    it('should execute request and detect a 204, and throw NOT_FOUND err', () => {
      spyOn(networkStateProvider, 'getNetworkState')
        .and
        .returnValue(ConnectionStatus.ONLINE);

      // call method
      provider.getVehicleByIdentifier('ABC123')
        .subscribe({
          next: () => {
          },
          error: (err) => expect(err)
            .toEqual(new Error(MotDetailsErr.NOT_FOUND)),
        });

      // stub response
      const req = httpMock.expectOne('https://www.example.com/1.0/checkMot?identifier=ABC123');
      req.flush(null, {
        status: HttpStatusCodes.NO_CONTENT,
        statusText: 'No content',
      });

      // expect HTTP methods and providers to have been called, and motError$ to have been set
      expect(req.request.method)
        .toEqual('GET');
      expect(urlProvider.getTaxMotUrl)
        .toHaveBeenCalled();
      expect(motError$.getValue())
        .toEqual(ERROR_MSGS.NOT_FOUND);
    });
    it('should catch errors', () => {
      spyOn(networkStateProvider, 'getNetworkState')
        .and
        .returnValue(ConnectionStatus.ONLINE);

      // call method
      provider
        .getVehicleByIdentifier('ABC123')
        .subscribe({
          next: () => {
          },
          error: () => {
          },
        });

      // stub response
      const req = httpMock.expectOne('https://www.example.com/1.0/checkMot?identifier=ABC123');
      req.flush(new HttpErrorResponse({}), {
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        statusText: 'Internal server error',
      });

      // expect HTTP methods and providers to have been called, and motError$ to have been set
      expect(req.request.method)
        .toEqual('GET');
      expect(urlProvider.getTaxMotUrl)
        .toHaveBeenCalled();
      expect(motError$.getValue())
        .toEqual(ERROR_MSGS.UNAVAILABLE);
    });
  });
  describe('clearMotData', () => {
    it('should reset the temp values and set motError$ to be null', () => {
      provider.clearMotData();
      expect(motError$.getValue())
        .toEqual(null);
    });
  });
});

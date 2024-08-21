import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  mockDriverPhoto,
  mockDriverSignature,
  mockDriverStandard,
} from '@providers/candidate-licence/__mocks__/candidate-licence.mock';
import {
  CandidateLicenceErr,
  CandidateLicenceProvider,
  DriverLicenceDetails,
} from '@providers/candidate-licence/candidate-licence';
import { of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '../../app-config/app-config';
import { NetworkStateProviderMock } from '../../network-state/__mocks__/network-state.mock';
import { ConnectionStatus, NetworkStateProvider } from '../../network-state/network-state';
import { UrlProviderMock } from '../../url/__mocks__/url.mock';
import { UrlProvider } from '../../url/url';

describe('CandidateLicenceProvider', () => {
  let candidateLicenceProvider: CandidateLicenceProvider;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CandidateLicenceProvider,
        {
          provide: UrlProvider,
          useClass: UrlProviderMock,
        },
        {
          provide: NetworkStateProvider,
          useClass: NetworkStateProviderMock,
        },
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    candidateLicenceProvider = TestBed.inject(CandidateLicenceProvider);
  });

  afterAll(() => {
    httpMock.verify();
  });

  describe('getCandidateData', () => {
    it('should return cached data if driverLicenceResponse matches drivingLicenceNumber', () => {
      candidateLicenceProvider.driverLicenceResponse = {
        drivingLicenceNumber: 'ABC1',
      } as DriverLicenceDetails;
      candidateLicenceProvider.requestError = null;

      candidateLicenceProvider.getCandidateData('ABC1', '1231212').subscribe((response) => {
        expect(response).toEqual(candidateLicenceProvider.driverLicenceResponse);
      });
    });

    it('should throw an error if requestError is set for cached data', () => {
      candidateLicenceProvider.driverLicenceResponse = {
        drivingLicenceNumber: 'ABC1',
      } as DriverLicenceDetails;
      candidateLicenceProvider.requestError = CandidateLicenceErr.NOT_FOUND;

      expect(() => candidateLicenceProvider.getCandidateData('ABC1', '1231212')).toThrowError(
        CandidateLicenceErr.NOT_FOUND
      );
    });

    it('should throw an error for NI licence', () => {
      expect(() => candidateLicenceProvider.getCandidateData('123456', '1231212')).toThrowError(
        CandidateLicenceErr.NI_LICENCE
      );
    });

    it('should throw an error if offline and no cached data', () => {
      spyOn(candidateLicenceProvider['networkStateProvider'], 'getNetworkState').and.returnValue(
        ConnectionStatus.OFFLINE
      );

      expect(() => candidateLicenceProvider.getCandidateData('ABC1', '1231212')).toThrowError(
        CandidateLicenceErr.OFFLINE
      );
    });

    it('should return combined data from all endpoints', () => {
      spyOn(candidateLicenceProvider, 'getDriverPhoto').and.returnValue(of(mockDriverPhoto));
      spyOn(candidateLicenceProvider, 'getDriverSignature').and.returnValue(of(mockDriverSignature));
      spyOn(candidateLicenceProvider, 'getDriverStandardData').and.returnValue(of(mockDriverStandard));

      candidateLicenceProvider.getCandidateData('ABC1', '1231212').subscribe((response) => {
        expect(response).toEqual({
          driverPhotograph: mockDriverPhoto,
          driverSignature: mockDriverSignature,
          driverStandard: mockDriverStandard,
        });
      });
    });

    it('should throw an error if any endpoint returns an error', () => {
      spyOn(candidateLicenceProvider, 'getDriverPhoto').and.throwError(CandidateLicenceErr.UNAVAILABLE);
      spyOn(candidateLicenceProvider, 'getDriverSignature').and.returnValue(of(mockDriverSignature));
      spyOn(candidateLicenceProvider, 'getDriverStandardData').and.returnValue(of(mockDriverStandard));

      expect(() => candidateLicenceProvider.getCandidateData('ABC1', '1231212')).toThrowError(
        CandidateLicenceErr.UNAVAILABLE
      );
    });

    it('should set requestError and driverLicenceResponse if not found', () => {
      spyOn(candidateLicenceProvider, 'getDriverPhoto').and.returnValue(
        throwError(() => new HttpErrorResponse({ status: 404 }))
      );
      spyOn(candidateLicenceProvider, 'getDriverSignature').and.returnValue(of(mockDriverSignature));
      spyOn(candidateLicenceProvider, 'getDriverStandardData').and.returnValue(of(mockDriverStandard));

      candidateLicenceProvider.getCandidateData('ABC1', '1231212').subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          expect(candidateLicenceProvider.requestError).toBe(CandidateLicenceErr.NOT_FOUND);
          expect(candidateLicenceProvider.driverLicenceResponse.drivingLicenceNumber).toBe('ABC1');
        },
      });
    });
  });

  describe('clearDriverData', () => {
    it('should set driverLicenceResponse and requestError to null', () => {
      candidateLicenceProvider.driverLicenceResponse = {
        driverPhotograph: null,
        driverSignature: null,
        driverStandard: null,
        drivingLicenceNumber: 'test',
      };
      candidateLicenceProvider.requestError = 'test';

      candidateLicenceProvider.clearDriverData();

      expect(candidateLicenceProvider.driverLicenceResponse).toBe(null);
      expect(candidateLicenceProvider.requestError).toBe(null);
    });
  });

  describe('getDriverPhoto', () => {
    it('should call getCandidatePhotoUrl and check request is a GET', () => {
      candidateLicenceProvider
        .getDriverPhoto('ABC1')
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual(mockDriverPhoto);
        });

      const req = httpMock.expectOne((request) => request.url === 'https://www.example.com/photo');

      expect(req.request.method).toBe('GET');
      req.flush(mockDriverPhoto);
    });
  });

  describe('getDriverSignature', () => {
    it('should call getCandidateSignatureUrl and check request is a GET', () => {
      candidateLicenceProvider
        .getDriverSignature('ABC1')
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual(mockDriverSignature);
        });

      const req = httpMock.expectOne((request) => request.url === 'https://www.example.com/signature');

      expect(req.request.method).toBe('GET');
      req.flush(mockDriverSignature);
    });
  });

  describe('getDriverStandardData', () => {
    it('should call getCandidateStandardDataUrl and check request is a POST with a payload', () => {
      candidateLicenceProvider
        .getDriverStandardData('ABC1', '1231212')
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual(mockDriverStandard);
        });

      const req = httpMock.expectOne((request) => request.url === 'https://www.example.com/standard');
      expect(req.request.body).toEqual({
        drivingLicenceNumber: 'ABC1',
        enquiryRefNumber: '1231212',
      });
      expect(req.request.method).toBe('POST');
      req.flush(mockDriverStandard);
    });
  });
});

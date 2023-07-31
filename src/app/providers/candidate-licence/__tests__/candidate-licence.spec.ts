import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CandidateLicenceProvider } from '@providers/candidate-licence/candidate-licence';
import {
  mockDriverPhoto,
  mockDriverSignature,
  mockDriverStandard,
} from '@providers/candidate-licence/__mocks__/candidate-licence.mock';
import { take } from 'rxjs/operators';
import { UrlProvider } from '../../url/url';
import { UrlProviderMock } from '../../url/__mocks__/url.mock';
import { NetworkStateProvider } from '../../network-state/network-state';
import { NetworkStateProviderMock } from '../../network-state/__mocks__/network-state.mock';
import { AppConfigProvider } from '../../app-config/app-config';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';

describe('CandidateLicenceProvider', () => {
  let candidateLicenceProvider: CandidateLicenceProvider;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
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

      expect(candidateLicenceProvider.driverLicenceResponse)
        .toBe(null);
      expect(candidateLicenceProvider.requestError)
        .toBe(null);
    });
  });

  describe('getDriverPhoto', () => {
    it('should call getCandidatePhotoUrl and check request is a GET', () => {
      candidateLicenceProvider
        .getDriverPhoto('ABC1')
        .pipe(take(1))
        .subscribe((response) => {
          expect(response)
            .toEqual(mockDriverPhoto);
        });

      const req = httpMock.expectOne(
        (request) => request.url === 'https://www.example.com/photo',
      );

      expect(req.request.method)
        .toBe('GET');
      req.flush(mockDriverPhoto);
    });
  });

  describe('getDriverSignature', () => {
    it('should call getCandidateSignatureUrl and check request is a GET', () => {
      candidateLicenceProvider
        .getDriverSignature('ABC1')
        .pipe(take(1))
        .subscribe((response) => {
          expect(response)
            .toEqual(mockDriverSignature);
        });

      const req = httpMock.expectOne(
        (request) => request.url === 'https://www.example.com/signature',
      );

      expect(req.request.method)
        .toBe('GET');
      req.flush(mockDriverSignature);
    });
  });

  describe('getDriverStandardData', () => {
    it('should call getCandidateStandardDataUrl and check request is a POST with a payload', () => {
      candidateLicenceProvider
        .getDriverStandardData('ABC1', '1231212')
        .pipe(take(1))
        .subscribe((response) => {
          expect(response)
            .toEqual(mockDriverStandard);
        });

      const req = httpMock.expectOne(
        (request) => request.url === 'https://www.example.com/standard',
      );
      expect(req.request.body)
        .toEqual({
          drivingLicenceNumber: 'ABC1',
          enquiryRefNumber: '1231212',
        });
      expect(req.request.method)
        .toBe('POST');
      req.flush(mockDriverStandard);
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CandidateLicenceProvider } from '@providers/candidate-licence/candidate-licence';
import { of } from 'rxjs';
import { UrlProvider } from '../../url/url';
import { UrlProviderMock } from '../../url/__mocks__/url.mock';
import { NetworkStateProvider } from '../../network-state/network-state';
import { NetworkStateProviderMock } from '../../network-state/__mocks__/network-state.mock';
import { AppConfigProvider } from '../../app-config/app-config';
import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';

/* eslint-disable */
describe('CandidateLicenceProvider', () => {
  let candidateLicenceProvider: CandidateLicenceProvider;
  let httpMock: HttpTestingController;
  let urlProviderMock: UrlProvider;
  let appConfigProviderMock: AppConfigProvider;
  let networkStateProviderMock: NetworkStateProvider;

  beforeEach(() => {
    jasmine.getEnv().allowRespy(true);
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        CandidateLicenceProvider,
        { provide: UrlProvider, useClass: UrlProviderMock },
        { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    candidateLicenceProvider = TestBed.inject(CandidateLicenceProvider);
    urlProviderMock = TestBed.inject(UrlProvider);
    appConfigProviderMock = TestBed.inject(AppConfigProvider);
    networkStateProviderMock = TestBed.inject(NetworkStateProvider);
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
    it('should call getCandidatePhotoUrl and call http.get with the result', () => {

      spyOn(urlProviderMock,'getCandidatePhotoUrl');
      spyOn(candidateLicenceProvider['http'],'get').and.returnValue(of('test'));

      candidateLicenceProvider.getDriverPhoto('test');

      expect(urlProviderMock.getCandidatePhotoUrl).toHaveBeenCalled();
      expect(candidateLicenceProvider['http'].get).toHaveBeenCalledWith('https://www.example.com/photo');
    });
  });

  describe('getDriverSignature', () => {
    it('should call getCandidateSignatureUrl and call http.get with the result', () => {

      spyOn(urlProviderMock,'getCandidateSignatureUrl');
      spyOn(candidateLicenceProvider['http'],'get').and.returnValue(of('test'));

      candidateLicenceProvider.getDriverSignature('test');

      expect(urlProviderMock.getCandidateSignatureUrl).toHaveBeenCalled();
      expect(candidateLicenceProvider['http'].get).toHaveBeenCalledWith('https://www.example.com/signature');
    });
  });

  describe('getDriverStandardData', () => {
    it('should call getCandidateStandardDataUrl and call http.post with the result', () => {

      spyOn(urlProviderMock,'getCandidateStandardDataUrl');
      spyOn(candidateLicenceProvider['http'],'post').and.returnValue(of('test'));

      candidateLicenceProvider.getDriverStandardData('testNum','testRef');

      expect(urlProviderMock.getCandidateStandardDataUrl).toHaveBeenCalled();
      expect(candidateLicenceProvider['http'].post).toHaveBeenCalledWith(
          'https://www.example.com/standard',
          {
            drivingLicenceNumber: 'testNum',
            enquiryRefNumber: 'testRef',
          },
      );
    });
  });
});

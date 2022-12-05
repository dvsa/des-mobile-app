import { UrlProvider } from '@providers/url/url';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SearchProvider } from '@providers/search/search';
import { UrlProviderMock } from '@providers/url/__mocks__/url.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { VehicleDetailsApiService } from './vehicle-details-api.service';

describe('VehicleDetailsApiService', () => {
  let vehicleDetailsService: VehicleDetailsApiService;
  let urlProvider: UrlProvider;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        SearchProvider,
        { provide: UrlProvider, useClass: UrlProviderMock },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    vehicleDetailsService = TestBed.inject(VehicleDetailsApiService);
    urlProvider = TestBed.inject(UrlProvider);
    spyOn(urlProvider, 'getTaxMotUrl');
  });

  describe('getVehicleByIdentifier', () => {
    it('should call the search endpoint with the provided driver number', () => {
      vehicleDetailsService.getVehicleByIdentifier('ABC123').subscribe();
      httpMock.expectOne('https://www.example.com/1.0/vehicle?identifier=ABC123');
      expect(urlProvider.getTaxMotUrl).toHaveBeenCalled();
    });
  });
});

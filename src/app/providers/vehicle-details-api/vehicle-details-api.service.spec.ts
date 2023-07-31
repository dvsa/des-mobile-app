import { UrlProvider } from '@providers/url/url';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SearchProvider } from '@providers/search/search';
import { UrlProviderMock } from '@providers/url/__mocks__/url.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { VehicleDetails } from '@providers/vehicle-details-api/vehicle-details-api.model';
import { VehicleDetailsApiService } from './vehicle-details-api.service';

// @TODO: Enable spec when full MOT feature introduced
xdescribe('VehicleDetailsApiService', () => {
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
    vehicleDetailsService = TestBed.inject(VehicleDetailsApiService);
    urlProvider = TestBed.inject(UrlProvider);
    spyOn(urlProvider, 'getTaxMotUrl');
  });

  describe('getVehicleByIdentifier', () => {
    it('should return an Observable of vehicleDetailsResponse if it is defined and'
      + ' vehicleRegistration is vehicleIdentifier', () => {
      vehicleDetailsService.vehicleIdentifier = 'ABC123';
      vehicleDetailsService.vehicleDetailsResponse = { registration: 'ABC123' } as VehicleDetails;
      vehicleDetailsService.getVehicleByIdentifier('ABC123')
        .subscribe((val) => {
          expect(val)
            .toEqual({ registration: 'ABC123' } as VehicleDetails);
        });
    });
    it('should call the search endpoint with the provided driver number', () => {
      vehicleDetailsService.getVehicleByIdentifier('ABC123')
        .subscribe();
      httpMock.expectOne('https://www.example.com/1.0/checkMot?identifier=ABC123');
      expect(urlProvider.getTaxMotUrl)
        .toHaveBeenCalled();
    });
  });
  describe('clearVehicleData', () => {
    it('should set vehicleIdentifier to null and vehicleDetailsResponse to undefined', () => {
      vehicleDetailsService.clearVehicleData();
      expect(vehicleDetailsService.vehicleIdentifier)
        .toEqual(null);
      expect(vehicleDetailsService.vehicleDetailsResponse)
        .toEqual(undefined);
    });
  });
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { SearchProvider } from '@providers/search/search';
import { UrlProviderMock } from '@providers/url/__mocks__/url.mock';
import { UrlProvider } from '@providers/url/url';
import { VehicleMOTDetails } from '@providers/vehicle-details-api/vehicle-details-api.model';
import { MotDataWithStatus, VehicleDetailsApiService } from '../vehicle-details-api.service';
import { MotStatusCodes } from '@shared/models/mot-status-codes';
import { PracticeModeMOTType } from '@pages/waiting-room-to-car/components/mot-components/practice-mode-mot-modal/practice-mode-mot-modal.component';
import {HttpHeaders, HttpResponse} from '@angular/common/http';
import { HttpStatusCodes } from '@shared/models/http-status-codes';
import {of, throwError} from 'rxjs';

describe('VehicleDetailsApiService', () => {
  let vehicleDetailsService: VehicleDetailsApiService;
  let urlProvider: UrlProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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

    vehicleDetailsService = TestBed.inject(VehicleDetailsApiService);
    urlProvider = TestBed.inject(UrlProvider);
    spyOn(urlProvider, 'getMotUrl');
  });

  describe('addRegistrationToFakeRecords', () => {
    it('should add the registration to the fake MOT records', () => {
      const motData: MotDataWithStatus = {
        status: '200',
        data: {
          registration: 'OLD_REG',
          make: 'fakeMake',
          model: 'fakeModel',
          status: MotStatusCodes.VALID,
          expiryDate: '01/01/01',
        },
      };
      const result = vehicleDetailsService.addRegistrationToFakeRecords('NEW_REG', motData);
      expect(result.data.registration).toBe('NEW_REG');
    });
  });

  describe('getMockResultByIdentifier', () => {
    it('should return pass MOT data when motType is PASS', (done) => {
      vehicleDetailsService.getMockResultByIdentifier('XX01VLD', PracticeModeMOTType.PASS).subscribe((result) => {
        expect(result.data.registration).toBe('XX01VLD');
        expect(result.data.status).toBe(MotStatusCodes.VALID);
        done();
      });
    });

    it('should return fail MOT data when motType is FAILED', (done) => {
      vehicleDetailsService.getMockResultByIdentifier('XX01INV', PracticeModeMOTType.FAILED).subscribe((result) => {
        expect(result.data.registration).toBe('XX01INV');
        expect(result.data.status).toBe(MotStatusCodes.NOT_VALID);
        done();
      });
    });

    it('should return no details MOT data when motType is NO_DETAILS', (done) => {
      vehicleDetailsService.getMockResultByIdentifier('XX01NDT', PracticeModeMOTType.NO_DETAILS).subscribe((result) => {
        expect(result.data.registration).toBe('XX01NDT');
        expect(result.data.status).toBe(MotStatusCodes.NO_DETAILS);
        done();
      });
    });
  });

  describe('clearVehicleData', () => {
    it('should set vehicleIdentifier to null and vehicleDetailsResponse to undefined', () => {
      vehicleDetailsService.clearVehicleData();
      expect(vehicleDetailsService.vehicleIdentifier).toEqual(null);
      expect(vehicleDetailsService.vehicleDetailsResponse).toEqual(undefined);
    });
  });

  describe('isVehicleCached', () => {
    it('should return true if vehicleRegistration matches vehicleIdentifier and vehicleDetailsResponse is defined', () => {
      vehicleDetailsService.vehicleIdentifier = 'ABC123';
      vehicleDetailsService.vehicleDetailsResponse = { registration: 'ABC123' } as VehicleMOTDetails;
      expect(vehicleDetailsService.isVehicleCached('ABC123')).toBe(true);
    });

    it('should return false if vehicleRegistration does not match vehicleIdentifier', () => {
      vehicleDetailsService.vehicleIdentifier = 'XYZ789';
      vehicleDetailsService.vehicleDetailsResponse = { registration: 'XYZ789' } as VehicleMOTDetails;
      expect(vehicleDetailsService.isVehicleCached('ABC123')).toBe(false);
    });

    it('should return false if vehicleDetailsResponse is undefined', () => {
      vehicleDetailsService.vehicleIdentifier = 'ABC123';
      vehicleDetailsService.vehicleDetailsResponse = undefined;
      expect(vehicleDetailsService.isVehicleCached('ABC123')).toBe(false);
    });
  });

  describe('getCachedVehicleDetails', () => {
    it('should return cached vehicle details with status "Already Saved"', () => {
      vehicleDetailsService.vehicleDetailsResponse = { registration: 'ABC123' } as VehicleMOTDetails;
      vehicleDetailsService.getCachedVehicleDetails().subscribe((val) => {
        expect(val).toEqual({
          status: 'Already Saved',
          data: {
            registration: 'ABC123',
          } as VehicleMOTDetails,
        });
      });
    });

    it('should return cached vehicle details with all fields populated', () => {
      vehicleDetailsService.vehicleDetailsResponse = {
        registration: 'ABC123',
        make: 'Toyota',
        model: 'Corolla',
        status: MotStatusCodes.VALID,
        expiryDate: '31/12/2023',
      } as VehicleMOTDetails;
      vehicleDetailsService.getCachedVehicleDetails().subscribe((val) => {
        expect(val).toEqual({
          status: 'Already Saved',
          data: {
            registration: 'ABC123',
            make: 'Toyota',
            model: 'Corolla',
            status: MotStatusCodes.VALID,
            expiryDate: '31/12/2023',
          } as VehicleMOTDetails,
        });
      });
    });

    it('should return cached vehicle details with null fields if not populated', () => {
      vehicleDetailsService.vehicleDetailsResponse = {
        registration: 'ABC123',
        make: null,
        model: null,
        status: null,
        expiryDate: null,
      } as VehicleMOTDetails;
      vehicleDetailsService.getCachedVehicleDetails().subscribe((val) => {
        expect(val).toEqual({
          status: 'Already Saved',
          data: {
            registration: 'ABC123',
            make: null,
            model: null,
            status: null,
            expiryDate: null,
          } as VehicleMOTDetails,
        });
      });
    });
  });

  describe('cacheVehicleDetails', () => {
    it('should cache vehicle details if response status is OK', () => {
      const mockResponse = {
        body: { registration: 'ABC123' } as VehicleMOTDetails,
        status: HttpStatusCodes.OK,
      } as HttpResponse<VehicleMOTDetails>;

      vehicleDetailsService.cacheVehicleDetails(mockResponse);

      expect(vehicleDetailsService.vehicleIdentifier).toBe('ABC123');
      expect(vehicleDetailsService.vehicleDetailsResponse).toEqual(mockResponse.body);
    });

    it('should not cache vehicle details if response status is not OK', () => {
      const mockResponse = {
        body: { registration: 'ABC123' } as VehicleMOTDetails,
        status: HttpStatusCodes.NOT_FOUND,
      } as HttpResponse<VehicleMOTDetails>;

      vehicleDetailsService.cacheVehicleDetails(mockResponse);

      expect(vehicleDetailsService.vehicleIdentifier).toBeUndefined();
      expect(vehicleDetailsService.vehicleDetailsResponse).toBeUndefined();
    });

    it('should handle response with null body', () => {
      const mockResponse = {
        body: null,
        status: HttpStatusCodes.OK,
      } as HttpResponse<VehicleMOTDetails>;

      vehicleDetailsService.cacheVehicleDetails(mockResponse);

      expect(vehicleDetailsService.vehicleIdentifier).toBeUndefined();
      expect(vehicleDetailsService.vehicleDetailsResponse).toBeNull();
    });
  });

  describe('mapResponseToMotData', () => {
    it('should format the expiry date if it exists in the response', () => {
      const mockResponse = {
        body: { registration: 'ABC123', expiryDate: '2023-12-31' } as VehicleMOTDetails,
        status: HttpStatusCodes.OK,
      } as HttpResponse<VehicleMOTDetails>;

      const result = vehicleDetailsService.mapResponseToMotData(mockResponse);
      expect(result.data.expiryDate).toBe('31/12/2023');
    });

    it('should return the status as a string', () => {
      const mockResponse = {
        body: { registration: 'ABC123' } as VehicleMOTDetails,
        status: HttpStatusCodes.OK,
      } as HttpResponse<VehicleMOTDetails>;

      const result = vehicleDetailsService.mapResponseToMotData(mockResponse);
      expect(result.status).toBe('200');
    });

    it('should handle response with no expiry date', () => {
      const mockResponse = {
        body: { registration: 'ABC123', expiryDate: null } as VehicleMOTDetails,
        status: HttpStatusCodes.OK,
      } as HttpResponse<VehicleMOTDetails>;

      const result = vehicleDetailsService.mapResponseToMotData(mockResponse);
      expect(result.data.expiryDate).toBeNull();
    });

    it('should handle response with null body', () => {
      const mockResponse = {
        body: null,
        status: HttpStatusCodes.OK,
      } as HttpResponse<VehicleMOTDetails>;

      const result = vehicleDetailsService.mapResponseToMotData(mockResponse);
      expect(result.data).toBeNull();
    });
  });

  describe('handleError', () => {
    it('should return default response with status and vehicle registration', () => {
      const error = { status: 500 };
      vehicleDetailsService.handleError(error, 'ABC123').subscribe((val) => {
        expect(val).toEqual({
          status: '500',
          data: {
            registration: 'ABC123',
            make: null,
            model: null,
            status: MotStatusCodes.NO_DETAILS,
            expiryDate: null,
          },
        });
      });
    });

    it('should handle error with status 404', () => {
      const error = { status: 404 };
      vehicleDetailsService.handleError(error, 'XYZ789').subscribe((val) => {
        expect(val).toEqual({
          status: '404',
          data: {
            registration: 'XYZ789',
            make: null,
            model: null,
            status: MotStatusCodes.NO_DETAILS,
            expiryDate: null,
          },
        });
      });
    });

    it('should handle error with no status', () => {
      const error = {};
      vehicleDetailsService.handleError(error, 'NO_STATUS').subscribe((val) => {
        expect(val).toEqual({
          status: undefined,
          data: {
            registration: 'NO_STATUS',
            make: null,
            model: null,
            status: MotStatusCodes.NO_DETAILS,
            expiryDate: null,
          },
        });
      });
    });
  });

  describe('getRequestHeaders', () => {
    it('should return a header with the correct key', () => {
      spyOn(vehicleDetailsService['urlProvider'], 'getTaxMotApiKey').and.returnValue('test-key');
      const result = vehicleDetailsService['getRequestHeaders']();
      expect(result.get('x-api-key')).toBe('test-key');
    });
  });

  describe('getVehicleByIdentifier', () => {
    it('should return cached vehicle details if vehicle is cached', (done) => {
      spyOn(vehicleDetailsService, 'isVehicleCached').and.returnValue(true);
      spyOn(vehicleDetailsService, 'getCachedVehicleDetails').and.returnValue(of({
        status: 'Already Saved',
        data: { registration: 'ABC123' } as VehicleMOTDetails,
      }));

      vehicleDetailsService.getVehicleByIdentifier('ABC123').subscribe((result) => {
        expect(result.status).toBe('Already Saved');
        expect(result.data.registration).toBe('ABC123');
        done();
      });
    });

    it('should fetch vehicle details from API if vehicle is not cached', (done) => {
      spyOn(vehicleDetailsService, 'isVehicleCached').and.returnValue(false);
      spyOn(vehicleDetailsService, 'getRequestHeaders').and.returnValue(new HttpHeaders());
      spyOn(vehicleDetailsService['http'], 'get').and.returnValue(of(new HttpResponse<VehicleMOTDetails>({
        body: { registration: 'ABC123' } as VehicleMOTDetails,
        status: HttpStatusCodes.OK,
      })));
      spyOn(vehicleDetailsService, 'cacheVehicleDetails');
      spyOn(vehicleDetailsService, 'mapResponseToMotData').and.callThrough();

      vehicleDetailsService.getVehicleByIdentifier('ABC123').subscribe((result) => {
        expect(result.data.registration).toBe('ABC123');
        expect(vehicleDetailsService.cacheVehicleDetails).toHaveBeenCalled();
        expect(vehicleDetailsService.mapResponseToMotData).toHaveBeenCalled();
        done();
      });
    });

    it('should handle API error and return default error response', (done) => {
      spyOn(vehicleDetailsService, 'isVehicleCached').and.returnValue(false);
      spyOn(vehicleDetailsService, 'getRequestHeaders').and.returnValue(new HttpHeaders());
      spyOn(vehicleDetailsService['http'], 'get').and.returnValue(throwError({ status: 500 }));
      spyOn(vehicleDetailsService, 'handleError').and.returnValue(of({
        status: '500',
        data: {
          registration: 'ABC123',
          make: null,
          model: null,
          status: MotStatusCodes.NO_DETAILS,
          expiryDate: null,
        },
      }));

      vehicleDetailsService.getVehicleByIdentifier('ABC123').subscribe((result) => {
        expect(result.status).toBe('500');
        expect(result.data.registration).toBe('ABC123');
        done();
      });
    });
  });
});

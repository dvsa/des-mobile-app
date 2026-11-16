import { HttpErrorResponse, HttpResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MotHistory } from '@dvsa/mes-mot-schema';
import { PracticeModeMOTType } from '@pages/waiting-room-to-car/components/mot-components/practice-mode-mot-modal/practice-mode-mot-modal.component';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { SearchProvider } from '@providers/search/search';
import { UrlProviderMock } from '@providers/url/__mocks__/url.mock';
import { UrlProvider } from '@providers/url/url';
import { HttpStatusCodes } from '@shared/models/http-status-codes';
import { firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MotHistoryApiService, MotHistoryWithStatus } from '../mot-history-api.service';

describe('MotHistoryApiService', () => {
  let vehicleDetailsService: MotHistoryApiService;
  let urlProvider: UrlProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
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
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    vehicleDetailsService = TestBed.inject(MotHistoryApiService);
    urlProvider = TestBed.inject(UrlProvider);
    vi.spyOn(urlProvider, 'getMotUrl');
  });

  describe('addRegistrationToFakeRecords', () => {
    it('should add the registration to the fake MOT records', () => {
      const motData: MotHistoryWithStatus = {
        status: '200',
        data: {
          registration: 'OLD_REG',
          make: 'fakeMake',
          model: 'fakeModel',
          status: 'Valid',
          expiryDate: '01/01/01',
        },
      };
      const result = vehicleDetailsService.addRegistrationToFakeRecords('NEW_REG', motData);
      expect(result.data.registration).toBe('NEW_REG');
    });
  });

  describe('getMockResultByIdentifier', () => {
    it('should return pass MOT data when motType is PASS', async () => {
      const result = await firstValueFrom(
        vehicleDetailsService.getMockResultByIdentifier('XX01VLD', PracticeModeMOTType.PASS)
      );
      expect(result.data.registration).toBe('XX01VLD');
      expect(result.data.status).toBe('Valid');
    });

    it('should return fail MOT data when motType is FAILED', async () => {
      const result = await firstValueFrom(
        vehicleDetailsService.getMockResultByIdentifier('XX01INV', PracticeModeMOTType.FAILED)
      );
      expect(result.data.registration).toBe('XX01INV');
      expect(result.data.status).toBe('Not valid');
    });

    it('should return no details MOT data when motType is NO_DETAILS', async () => {
      const result = await firstValueFrom(
        vehicleDetailsService.getMockResultByIdentifier('XX01NDT', PracticeModeMOTType.NO_DETAILS)
      );
      expect(result.data.registration).toBe('XX01NDT');
      expect(result.data.status).toBe('No details');
    });
  });

  describe('clearVehicleData', () => {
    it('should set vehicleIdentifier to null and vehicleDetailsResponse to undefined', () => {
      vehicleDetailsService.clearVehicleData();
      expect(vehicleDetailsService.vehicleIdentifier).toEqual(null);
      expect(vehicleDetailsService.motHistoryResponse).toEqual(undefined);
    });
  });

  describe('isVehicleCached', () => {
    it('should return true if vehicleRegistration matches vehicleIdentifier and vehicleDetailsResponse is defined', () => {
      vehicleDetailsService.vehicleIdentifier = 'ABC123';
      vehicleDetailsService.motHistoryResponse = { registration: 'ABC123' } as MotHistory;
      expect(vehicleDetailsService.isResultCached('ABC123')).toBe(true);
    });

    it('should return false if vehicleRegistration does not match vehicleIdentifier', () => {
      vehicleDetailsService.vehicleIdentifier = 'XYZ789';
      vehicleDetailsService.motHistoryResponse = { registration: 'XYZ789' } as MotHistory;
      expect(vehicleDetailsService.isResultCached('ABC123')).toBe(false);
    });

    it('should return false if vehicleDetailsResponse is undefined', () => {
      vehicleDetailsService.vehicleIdentifier = 'ABC123';
      vehicleDetailsService.motHistoryResponse = undefined;
      expect(vehicleDetailsService.isResultCached('ABC123')).toBe(false);
    });
  });

  describe('getCachedVehicleDetails', () => {
    it('should return cached vehicle details with status "Already Saved"', () => {
      vehicleDetailsService.motHistoryResponse = { registration: 'ABC123' } as MotHistory;
      vehicleDetailsService.getCachedMotHistory().subscribe((val) => {
        expect(val).toEqual({
          status: 'Already Saved',
          data: {
            registration: 'ABC123',
          } as MotHistory,
        });
      });
    });

    it('should return cached vehicle details with all fields populated', () => {
      vehicleDetailsService.motHistoryResponse = {
        registration: 'ABC123',
        make: 'Toyota',
        model: 'Corolla',
        status: 'Valid',
        expiryDate: '31/12/2023',
      } as MotHistory;
      vehicleDetailsService.getCachedMotHistory().subscribe((val) => {
        expect(val).toEqual({
          status: 'Already Saved',
          data: {
            registration: 'ABC123',
            make: 'Toyota',
            model: 'Corolla',
            status: 'Valid',
            expiryDate: '31/12/2023',
          } as MotHistory,
        });
      });
    });

    it('should return cached vehicle details with null fields if not populated', () => {
      vehicleDetailsService.motHistoryResponse = {
        registration: 'ABC123',
        make: null,
        model: null,
        status: null,
        expiryDate: null,
      } as MotHistory;
      vehicleDetailsService.getCachedMotHistory().subscribe((val) => {
        expect(val).toEqual({
          status: 'Already Saved',
          data: {
            registration: 'ABC123',
            make: null,
            model: null,
            status: null,
            expiryDate: null,
          } as MotHistory,
        });
      });
    });
  });

  describe('cacheVehicleDetails', () => {
    it('should cache vehicle details if response status is OK', () => {
      const mockResponse = {
        body: { registration: 'ABC123' } as MotHistory,
        status: HttpStatusCodes.OK,
      } as HttpResponse<MotHistory>;

      vehicleDetailsService.cacheMotHistory(mockResponse);

      expect(vehicleDetailsService.vehicleIdentifier).toBe('ABC123');
      expect(vehicleDetailsService.motHistoryResponse).toEqual(mockResponse.body);
    });

    it('should not cache vehicle details if response status is not OK', () => {
      const mockResponse = {
        body: { registration: 'ABC123' } as MotHistory,
        status: HttpStatusCodes.NOT_FOUND,
      } as HttpResponse<MotHistory>;

      vehicleDetailsService.cacheMotHistory(mockResponse);

      expect(vehicleDetailsService.vehicleIdentifier).toBeUndefined();
      expect(vehicleDetailsService.motHistoryResponse).toBeUndefined();
    });

    it('should handle response with null body', () => {
      const mockResponse = {
        body: null,
        status: HttpStatusCodes.OK,
      } as HttpResponse<MotHistory>;

      vehicleDetailsService.cacheMotHistory(mockResponse);

      expect(vehicleDetailsService.vehicleIdentifier).toBeUndefined();
      expect(vehicleDetailsService.motHistoryResponse).toBeNull();
    });
  });

  describe('mapResponseToMotData', () => {
    it('should format the expiry date if it exists in the response', () => {
      const mockResponse = {
        body: { registration: 'ABC123', expiryDate: '2023-12-31' } as MotHistory,
        status: HttpStatusCodes.OK,
      } as HttpResponse<MotHistory>;

      const result = vehicleDetailsService.mapResponseToMotData(mockResponse);
      expect(result.data.expiryDate).toBe('31/12/2023');
    });

    it('should return the status as a string', () => {
      const mockResponse = {
        body: { registration: 'ABC123' } as MotHistory,
        status: HttpStatusCodes.OK,
      } as HttpResponse<MotHistory>;

      const result = vehicleDetailsService.mapResponseToMotData(mockResponse);
      expect(result.status).toBe('200');
    });

    it('should handle response with no expiry date', () => {
      const mockResponse = {
        body: { registration: 'ABC123', expiryDate: null } as MotHistory,
        status: HttpStatusCodes.OK,
      } as HttpResponse<MotHistory>;

      const result = vehicleDetailsService.mapResponseToMotData(mockResponse);
      expect(result.data.expiryDate).toBeNull();
    });

    it('should handle response with null body', () => {
      const mockResponse = {
        body: null,
        status: HttpStatusCodes.OK,
      } as HttpResponse<MotHistory>;

      const result = vehicleDetailsService.mapResponseToMotData(mockResponse);
      expect(result.data).toBeNull();
    });
  });

  describe('handleError', () => {
    it('should return default response with status and vehicle registration', () => {
      const error = new HttpErrorResponse({ error: {}, status: 500 });
      vehicleDetailsService.handleError(error, 'ABC123').subscribe((val) => {
        expect(val).toEqual({
          status: '500',
          data: {
            registration: 'ABC123',
            make: null,
            model: null,
            status: 'No details',
            expiryDate: null,
          },
        });
      });
    });

    it('should handle error with status 404', () => {
      const error = new HttpErrorResponse({ error: {}, status: 404 });
      vehicleDetailsService.handleError(error, 'XYZ789').subscribe((val) => {
        expect(val).toEqual({
          status: '404',
          data: {
            registration: 'XYZ789',
            make: null,
            model: null,
            status: 'No details',
            expiryDate: null,
          },
        });
      });
    });

    it('should handle error with no status', () => {
      const error = new HttpErrorResponse({ error: {}, status: 0 });
      vehicleDetailsService.handleError(error, 'NO_STATUS').subscribe((val) => {
        expect(val).toEqual({
          status: undefined,
          data: {
            registration: 'NO_STATUS',
            make: null,
            model: null,
            status: 'No details',
            expiryDate: null,
          },
        });
      });
    });
  });

  describe('getVehicleByIdentifier', () => {
    it('should return cached vehicle details if vehicle is cached', async () => {
      vi.spyOn(vehicleDetailsService, 'isResultCached').mockReturnValue(true);
      vi.spyOn(vehicleDetailsService, 'getCachedMotHistory').mockReturnValue(
        of({
          status: 'Already Saved',
          data: { registration: 'ABC123' } as MotHistory,
        })
      );
      const result = await firstValueFrom(vehicleDetailsService.getMotHistoryByIdentifier('ABC123'));
      expect(result.status).toBe('Already Saved');
      expect(result.data.registration).toBe('ABC123');
    });

    it('should fetch vehicle details from API if vehicle is not cached', async () => {
      vi.spyOn(vehicleDetailsService, 'isResultCached').mockReturnValue(false);
      vi.spyOn(vehicleDetailsService.http, 'get').mockReturnValue(
        of(
          new HttpResponse<MotHistory>({
            body: { registration: 'ABC123' } as MotHistory,
            status: HttpStatusCodes.OK,
          })
        )
      );
      vi.spyOn(vehicleDetailsService, 'cacheMotHistory').mockReturnValue(undefined);
      vi.spyOn(vehicleDetailsService, 'mapResponseToMotData');
      const result = await firstValueFrom(vehicleDetailsService.getMotHistoryByIdentifier('ABC123'));
      expect(result.data.registration).toBe('ABC123');
      expect(vehicleDetailsService.cacheMotHistory).toHaveBeenCalled();
      expect(vehicleDetailsService.mapResponseToMotData).toHaveBeenCalled();
    });

    it('should handle API error and return default error response', async () => {
      vi.spyOn(vehicleDetailsService, 'isResultCached').mockReturnValue(false);
      vi.spyOn(vehicleDetailsService.http, 'get').mockReturnValue(throwError({ status: 500 }));
      vi.spyOn(vehicleDetailsService, 'handleError').mockReturnValue(
        of({
          status: '500',
          data: {
            registration: 'ABC123',
            make: null,
            model: null,
            status: 'No details',
            expiryDate: null,
          },
        })
      );
      const result = await firstValueFrom(vehicleDetailsService.getMotHistoryByIdentifier('ABC123'));
      expect(result.status).toBe('500');
      expect(result.data.registration).toBe('ABC123');
    });
  });
});

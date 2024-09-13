import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MotHistory, MotStatusCodes } from '@dvsa/mes-mot-schema';
import { PracticeModeMOTType } from '@pages/waiting-room-to-car/components/mot-components/practice-mode-mot-modal/practice-mode-mot-modal.component';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { UrlProvider } from '@providers/url/url';
import { DateTime } from '@shared/helpers/date-time';
import { HttpStatusCodes } from '@shared/models/http-status-codes';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, timeout } from 'rxjs/operators';

export interface MotHistoryWithStatus {
  status: string;
  data: MotHistory;
}

@Injectable({
  providedIn: 'root',
})
export class VehicleDetailsApiService {
  constructor(
    private http: HttpClient,
    private urlProvider: UrlProvider,
    public appConfig: AppConfigProvider
  ) {}

  vehicleIdentifier: string;
  vehicleDetailsResponse: MotHistory;

  fakeMOTResults: { pass: MotHistoryWithStatus; fail: MotHistoryWithStatus; noDetails: MotHistoryWithStatus } = {
    pass: {
      status: '200',
      data: {
        registration: 'XX01VLD',
        make: 'fakeMake',
        model: 'fakeModel',
        status: MotStatusCodes.VALID,
        expiryDate: '01/01/01',
      },
    },
    fail: {
      status: '200',
      data: {
        registration: 'XX01INV',
        make: 'fakeMake',
        model: 'fakeModel',
        status: MotStatusCodes.NOT_VALID,
        expiryDate: '01/01/01',
      },
    },
    noDetails: {
      status: '200',
      data: {
        registration: 'XX01NDT',
        make: '-',
        model: '-',
        status: MotStatusCodes.NO_DETAILS,
        expiryDate: '01/01/01',
      },
    },
  };

  /**
   * Adds the given registration to the provided MOT data.
   *
   * @param {string} registration - The vehicle registration to add.
   * @param {MotHistoryWithStatus} motData - The MOT data to which the registration will be added.
   * @returns {MotHistoryWithStatus} The updated MOT data with the new registration.
   */
  addRegistrationToFakeRecords(registration: string, motData: MotHistoryWithStatus): MotHistoryWithStatus {
    const returnData = motData;
    returnData.data.registration = registration;
    return returnData;
  }

  /**
   * Returns mock MOT result based on the provided vehicle registration and MOT type.
   *
   * @param {string} vehicleRegistration - The vehicle registration to add to the mock result.
   * @param {PracticeModeMOTType} motType - The type of MOT result to return (PASS, FAILED, NO_DETAILS).
   * @returns {Observable<MotHistoryWithStatus>} An observable containing the mock MOT result with the updated registration.
   */
  getMockResultByIdentifier(
    vehicleRegistration: string,
    motType: PracticeModeMOTType
  ): Observable<MotHistoryWithStatus> {
    switch (motType) {
      case PracticeModeMOTType.PASS:
        return of(this.addRegistrationToFakeRecords(vehicleRegistration, this.fakeMOTResults.pass));
      case PracticeModeMOTType.FAILED:
        return of(this.addRegistrationToFakeRecords(vehicleRegistration, this.fakeMOTResults.fail));
      case PracticeModeMOTType.NO_DETAILS:
        return of(this.addRegistrationToFakeRecords(vehicleRegistration, this.fakeMOTResults.noDetails));
    }
  }

  /**
   * Retrieves vehicle details by vehicle registration.
   *
   * If the vehicle details are cached, it returns the cached details.
   * Otherwise, it fetches the details from the API, caches them, and returns the result.
   *
   * @param {string} vehicleRegistration - The vehicle registration to look up.
   * @returns {Observable<MotHistoryWithStatus>} An observable containing the MOT data with status.
   */
  getVehicleByIdentifier(vehicleRegistration: string): Observable<MotHistoryWithStatus> {
    if (this.isVehicleCached(vehicleRegistration)) {
      return this.getCachedVehicleDetails();
    }

    const headers = this.getRequestHeaders();

    return this.http.get(this.urlProvider.getMotUrl(vehicleRegistration), { observe: 'response', headers }).pipe(
      tap((response: HttpResponse<MotHistory>) => this.cacheVehicleDetails(response)),
      map((value): MotHistoryWithStatus => this.mapResponseToMotData(value)),
      timeout(this.appConfig.getAppConfig().requestTimeout),
      catchError((err) => this.handleError(err, vehicleRegistration))
    );
  }

  /**
   * Checks if the vehicle details are cached.
   *
   * @param {string} vehicleRegistration - The vehicle registration to check.
   * @returns {boolean} True if the vehicle details are cached, false otherwise.
   */
  isVehicleCached(vehicleRegistration: string): boolean {
    return vehicleRegistration === this.vehicleIdentifier && this.vehicleDetailsResponse !== undefined;
  }

  /**
   * Retrieves cached vehicle details.
   *
   * @returns {Observable<MotHistoryWithStatus>} An observable containing the cached MOT data with status.
   */
  getCachedVehicleDetails(): Observable<MotHistoryWithStatus> {
    return of({ status: 'Already Saved', data: this.vehicleDetailsResponse });
  }

  /**
   * Generates the HTTP headers required for the API request.
   *
   * @returns {HttpHeaders} The HTTP headers with the API key set.
   */
  getRequestHeaders(): HttpHeaders {
    return new HttpHeaders().set('x-api-key', this.urlProvider.getTaxMotApiKey());
  }

  /**
   * Caches the vehicle details.
   *
   * @param {HttpResponse<MotHistory>} response - The response containing the vehicle details to cache.
   */
  cacheVehicleDetails(response: HttpResponse<MotHistory>): void {
    if (response.status === HttpStatusCodes.OK) {
      this.vehicleIdentifier = response.body?.registration;
      this.vehicleDetailsResponse = response.body;
    }
  }

  /**
   * Maps the API response to the MOT data with status.
   *
   * @param {HttpResponse<MotHistory>} value - The API response to map.
   * @returns {MotHistoryWithStatus} The mapped MOT data with status.
   */
  mapResponseToMotData(value: HttpResponse<MotHistory>): MotHistoryWithStatus {
    if (value?.body?.expiryDate) {
      value.body.expiryDate = new DateTime(value.body.expiryDate).format('DD/MM/YYYY');
    }
    return {
      status: value.status.toString(),
      data: value.body,
    };
  }

  /**
   * Handles the error response from the API.
   *
   * @param {any} err - The error response to handle.
   * @param {string} vehicleRegistration - The vehicle registration for which the error occurred.
   * @returns {Observable<MotHistoryWithStatus>} An observable containing the MOT data with status.
   */
  handleError(err: any, vehicleRegistration: string): Observable<MotHistoryWithStatus> {
    const status = err.status ? err.status.toString() : undefined;
    return of({
      status: status,
      data: {
        registration: vehicleRegistration,
        make: null,
        model: null,
        status: MotStatusCodes.NO_DETAILS,
        expiryDate: null,
      },
    });
  }
  /**
   * Reset cached vehicle values
   */
  clearVehicleData(): void {
    this.vehicleIdentifier = null;
    this.vehicleDetailsResponse = undefined;
  }
}

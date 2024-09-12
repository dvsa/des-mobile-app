import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PracticeModeMOTType } from '@pages/waiting-room-to-car/components/mot-components/practice-mode-mot-modal/practice-mode-mot-modal.component';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { UrlProvider } from '@providers/url/url';
import { VehicleMOTDetails } from '@providers/vehicle-details-api/vehicle-details-api.model';
import { HttpStatusCodes } from '@shared/models/http-status-codes';
import { MotStatusCodes } from '@shared/models/mot-status-codes';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, timeout } from 'rxjs/operators';
import { DateTime } from '@shared/helpers/date-time';

export interface MotDataWithStatus {
  status: string;
  data: VehicleMOTDetails;
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
  vehicleDetailsResponse: VehicleMOTDetails;

  fakeMOTResults: { pass: MotDataWithStatus; fail: MotDataWithStatus; noDetails: MotDataWithStatus } = {
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

  addRegistrationToFakeRecords(registration: string, motData: MotDataWithStatus): MotDataWithStatus {
    const returnData = motData;
    returnData.data.registration = registration;
    return returnData;
  }

  getMockResultByIdentifier(vehicleRegistration: string, motType: PracticeModeMOTType): Observable<MotDataWithStatus> {
    switch (motType) {
      case PracticeModeMOTType.PASS:
        return of(this.addRegistrationToFakeRecords(vehicleRegistration, this.fakeMOTResults.pass));
      case PracticeModeMOTType.FAILED:
        return of(this.addRegistrationToFakeRecords(vehicleRegistration, this.fakeMOTResults.fail));
      case PracticeModeMOTType.NO_DETAILS:
        return of(this.addRegistrationToFakeRecords(vehicleRegistration, this.fakeMOTResults.noDetails));
    }
  }

  getVehicleByIdentifier(vehicleRegistration: string): Observable<MotDataWithStatus> {
    // Check if the vehicle registration matches the cached identifier and if the vehicle details are already saved
    if (vehicleRegistration === this.vehicleIdentifier && this.vehicleDetailsResponse !== undefined) {
      // Return the cached vehicle details
      return of({ status: 'Already Saved', data: this.vehicleDetailsResponse });
    }

    // Set the headers for the HTTP request, including the API key
    const headers = new HttpHeaders().set('x-api-key', this.urlProvider.getTaxMotApiKey());

    // Make an HTTP GET request to retrieve vehicle details by registration
    return this.http.get(this.urlProvider.getMotUrl(vehicleRegistration), { observe: 'response', headers }).pipe(
      // Tap into the response to cache the vehicle details if the request is successful
      tap((response: HttpResponse<VehicleMOTDetails>) => {
        if (response.status === HttpStatusCodes.OK) {
          this.vehicleIdentifier = response.body.registration;
          this.vehicleDetailsResponse = response.body;
        }
      }),
      // Map the response to the MotDataWithStatus format
      map((value): MotDataWithStatus => {
        //If there is an expiry date, format it to DD/MM/YYYY
        if (value.body.expiryDate) {
          value.body.expiryDate = new DateTime(value.body.expiryDate).format('DD/MM/YYYY');
        }
        return {
          status: value.status.toString(),
          data: value.body,
        };
      }),
      // Set a timeout for the request
      timeout(this.appConfig.getAppConfig().requestTimeout),
      // Catch any errors and return a default response with no details
      catchError((err) => {
        console.log('error');
        return of({
          status: err.status,
          data: {
            registration: vehicleRegistration,
            make: null,
            model: null,
            status: MotStatusCodes.NO_DETAILS,
            expiryDate: null,
          },
        });
      })
    );
  }

  /**
   * Reset cached vehicle values
   */
  clearVehicleData(): void {
    this.vehicleIdentifier = null;
    this.vehicleDetailsResponse = undefined;
  }
}

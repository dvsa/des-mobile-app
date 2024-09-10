import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { UrlProvider } from '@providers/url/url';
import { VehicleDetails } from '@providers/vehicle-details-api/vehicle-details-api.model';
import { HttpStatusCodes } from '@shared/models/http-status-codes';
import { MotStatusCodes } from '@shared/models/mot-status-codes';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, timeout } from 'rxjs/operators';
import { PracticeModeMOTType } from '@pages/waiting-room-to-car/components/mot-components/practice-mode-mot-modal/mot-failed-modal.component';

export interface MotDataWithStatus {
  status: string;
  data: VehicleDetails;
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
  vehicleDetailsResponse: VehicleDetails;

  fakeMOTResults: { pass: MotDataWithStatus; fail: MotDataWithStatus; noDetails: MotDataWithStatus } = {
    pass: {
      status: '200',
      data: {
        registration: 'XX01VLD',
        make: 'fakeMake',
        model: 'fakeModel',
        colour: 'Red',
        status: MotStatusCodes.VALID,
        testExpiryDate: '01/01/01',
        testDueDate: '01/01/01',
        testDate: '01/01/01',
      },
    },
    fail: {
      status: '200',
      data: {
        registration: 'XX01INV',
        make: 'fakeMake',
        model: 'fakeModel',
        colour: 'Red',
        status: MotStatusCodes.NOT_VALID,
        testExpiryDate: '01/01/01',
        testDueDate: '01/01/01',
        testDate: '01/01/01',
      },
    },
    noDetails: {
      status: '200',
      data: {
        registration: 'XX01NDT',
        make: '-',
        model: '-',
        colour: '-',
        status: MotStatusCodes.NO_DETAILS,
        testExpiryDate: '01/01/01',
        testDueDate: '01/01/01',
        testDate: '01/01/01',
      },
    },
  };

  getMockResultByIdentifier(motType: PracticeModeMOTType): Observable<MotDataWithStatus> {
    console.log('mocking MOT result', motType);
    switch (motType) {
      case PracticeModeMOTType.PASS:
        return of(this.fakeMOTResults.pass);
      case PracticeModeMOTType.FAILED:
        return of(this.fakeMOTResults.fail);
      case PracticeModeMOTType.NO_DETAILS:
        return of(this.fakeMOTResults.noDetails);
    }
  }

  getVehicleByIdentifier(vehicleRegistration: string): Observable<MotDataWithStatus> {
    if (vehicleRegistration === this.vehicleIdentifier && this.vehicleDetailsResponse !== undefined) {
      return of({ status: 'Already Saved', data: this.vehicleDetailsResponse });
    }

    const headers = new HttpHeaders().set('x-api-key', this.urlProvider.getTaxMotApiKey());

    return this.http.get(this.urlProvider.getTaxMotUrl(vehicleRegistration), { observe: 'response', headers }).pipe(
      tap((response: HttpResponse<VehicleDetails>) => {
        if (response.status === HttpStatusCodes.OK) {
          this.vehicleIdentifier = response.body.registration;
          this.vehicleDetailsResponse = response.body;
        }
      }),
      map((value): MotDataWithStatus => {
        return {
          status: value.status.toString(),
          data: value.body,
        };
      }),
      timeout(this.appConfig.getAppConfig().requestTimeout),
      catchError((err) => {
        return of({ status: err.status, data: null });
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

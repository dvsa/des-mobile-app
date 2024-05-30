import { Injectable } from '@angular/core';
import {
  HttpClient, HttpHeaders, HttpResponse,
} from '@angular/common/http';
import {
  timeout, tap, map, catchError,
} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UrlProvider } from '@providers/url/url';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { VehicleDetails } from '@providers/vehicle-details-api/vehicle-details-api.model';
import { HttpStatusCodes } from '@shared/models/http-status-codes';
import { MotStatusCodes } from '@shared/models/mot-status-codes';

export interface MotDataWithStatus {
  status: string,
  data: VehicleDetails,
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


  //This is here to help with visits and tests in places with poor connectivity,
  // this will be deleted in the full release
  fakeMOTResults: MotDataWithStatus[] = [
    {
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
      }
    },
    {
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
      }
    },
    {
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
      }
    }
  ]

  getFakeVehicleByIdentifier(vehicleRegistration: string): Observable<MotDataWithStatus> {
    console.log(this.fakeMOTResults.find(value => vehicleRegistration === value.data.registration));
    let returnData = this.fakeMOTResults.find(value => vehicleRegistration === value.data.registration);
    if (returnData) {
      return of(this.fakeMOTResults.find(value => vehicleRegistration === value.data.registration));
    } else {
      return of({status: '204', data: null});
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
      map((value):MotDataWithStatus => {
        return {
          status: value.status.toString(),
          data: value.body,
        };
      }),
      timeout(this.appConfig.getAppConfig().requestTimeout),
      catchError((err) => {
        return of({ status: err.status, data: null });
      }),
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

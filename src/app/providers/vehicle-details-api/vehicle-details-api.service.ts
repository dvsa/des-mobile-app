import { Injectable } from '@angular/core';
import {
  HttpClient, HttpHeaders, HttpParams, HttpResponse,
} from '@angular/common/http';
import {
  timeout, tap, map, catchError,
} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { UrlProvider } from '@providers/url/url';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { VehicleDetails } from '@providers/vehicle-details-api/vehicle-details-api.model';

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

  getVehicleByIdentifier(vehicleRegistration: string): Observable<MotDataWithStatus> {
    if (vehicleRegistration === this.vehicleIdentifier && this.vehicleDetailsResponse !== undefined) {
      return of({ status: 'Already Saved', data: this.vehicleDetailsResponse });
    }

    const headers = new HttpHeaders().set('x-api-key', this.urlProvider.getTaxMotApiKey());
    const params = new HttpParams().set('identifier', vehicleRegistration);

    return this.http.get(this.urlProvider.getTaxMotUrl(), { observe: 'response', headers, params }).pipe(
      tap((response: HttpResponse<VehicleDetails>) => {
        if (response.status === 200) {
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

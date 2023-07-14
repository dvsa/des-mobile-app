import { Injectable } from '@angular/core';
import {
  HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse,
} from '@angular/common/http';
import { catchError, map, timeout } from 'rxjs/operators';
import {
  BehaviorSubject, Observable, of, throwError,
} from 'rxjs';
import { UrlProvider } from '@providers/url/url';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { MotDetails } from '@providers/vehicle-details-api/vehicle-details-api.model';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { HttpStatusCodes } from '@shared/models/http-status-codes';
import {
  checkInvalidMotCount$,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';

export enum MotStatus {
  VALID = 'Valid',
  NOT_VALID = 'Not valid',
}

export enum MotDetailsErr {
  OFFLINE = 'OFFLINE',
  NOT_FOUND = 'NOT_FOUND',
  UNAVAILABLE = 'UNAVAILABLE',
}

export type MotErrorDisplay = {
  msg: string;
  action: string;
};

export const ERROR_MSGS: Record<MotDetailsErr, MotErrorDisplay> = {
  OFFLINE: {
    msg: 'No connection',
    action: 'Please continue with the test',
  },
  NOT_FOUND: {
    msg: 'No MOT details found',
    action: 'Please continue with the test',
  },
  UNAVAILABLE: {
    msg: 'Service is not available',
    action: 'Please continue with the test',
  },
};

export const motError$ = new BehaviorSubject<MotErrorDisplay>(null);

@Injectable({
  providedIn: 'root',
})
// @TODO: Rename to MotDetailsProvider
export class VehicleDetailsApiService {
  private vehicleDetailsResponse: MotDetails = null;
  private requestError: MotDetailsErr = null;

  constructor(
    private http: HttpClient,
    private urlProvider: UrlProvider,
    private appConfig: AppConfigProvider,
    private networkStateProvider: NetworkStateProvider,
  ) {
  }

  // @TODO: Rename to getMotDetailsByIdentifier
  public getVehicleByIdentifier(registration: string): Observable<MotDetails> {
    // used as internal cache to check for existing data/error
    if (this.vehicleDetailsResponse?.registration?.toUpperCase() === registration?.toUpperCase()) {

      // if the last search for a VRM returned a non-happy path result, then we re-use that error instead of re-querying
      if (this.requestError) {
        this.setMotError();
        return throwError(() => new Error(this.requestError));
      }
      // increment or reset search count based on MOT status
      this.setMotSearchCountWhenInvalid(this.vehicleDetailsResponse.status);
      // return the populated payload
      return of(this.vehicleDetailsResponse);
    }

    // intercept call to EP when offline
    if (this.networkStateProvider.getNetworkState() !== ConnectionStatus.ONLINE) {

      // don't store this.requestError = MotDetailsErr.OFFLINE
      // we want the user to be able to retry if connection established mid-flow
      motError$.next(ERROR_MSGS[MotDetailsErr.OFFLINE]);
      throw new Error(MotDetailsErr.OFFLINE);
    }

    const headers = new HttpHeaders().set('x-api-key', this.urlProvider.getTaxMotApiKey());
    const params = new HttpParams().set('identifier', registration);

    return this.http.get<MotDetails>(
      this.urlProvider.getTaxMotUrl(),
      {
        headers,
        params,
        observe: 'response',
      },
    )
      .pipe(
        map((
          {
            body,
            status,
          }: HttpResponse<MotDetails>,
        ) => {
          // regard 204 as an error as it is returned as an empty object, therefore we have no data to present
          if (status === HttpStatusCodes.NO_CONTENT) {
            this.handle204(registration);
          }
          // increment or reset search count based on MOT status
          this.setMotSearchCountWhenInvalid(body.status);
          // return payload
          return this.handle200(body);
        }),
        catchError((errorResponse: HttpErrorResponse | Error) => {
          // In case of HTTP error i.e. something in 400-500 range, show `service unavailable`
          if (errorResponse instanceof HttpErrorResponse) {
            this.requestError = MotDetailsErr.UNAVAILABLE;
            this.setMotError();
          }
          // We are capturing and reporting on the real error, so if something in the 400-500 range appeared we would
          // have visibility via the mobile app logs
          return throwError(() => errorResponse);
        }),
        timeout(this.appConfig.getAppConfig().requestTimeout),
      );
  }

  public clearVehicleData(): void {
    this.vehicleDetailsResponse = null;
    this.requestError = null;
    motError$.next(null);
    motError$.complete();
  }

  private handle200(body: MotDetails): MotDetails {
    this.requestError = null;
    this.setMotError();
    // store `vehicleDetailsResponse` with the response from the EP.
    this.vehicleDetailsResponse = { ...body };
    return body;
  }

  private handle204(registration: string): void {
    this.requestError = MotDetailsErr.NOT_FOUND;
    this.setMotError();
    // store registration as vehicleIdentifier to not re-query for same ref when no data was found
    this.vehicleDetailsResponse = {
      ...this.vehicleDetailsResponse,
      registration,
    } as MotDetails;
    // throw error so subscribers are aware
    throw new Error(this.requestError);
  }

  private setMotError(): void {
    // set the error in an observable that can be retrieved without recalling main function
    motError$.next(ERROR_MSGS[this.requestError]);
  }

  private setMotSearchCountWhenInvalid(status: string): void {
    checkInvalidMotCount$.next(
      (status === MotStatus.NOT_VALID) ? (checkInvalidMotCount$.value + 1) : 0,
    );
  }
}

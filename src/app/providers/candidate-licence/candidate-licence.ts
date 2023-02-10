import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  DriverLicenceSchema, DriverPhotograph, DriverSignature, DriverStandard,
} from '@dvsa/mes-driver-schema';
import { UrlProvider } from '@providers/url/url';
import { AppConfigProvider } from '@providers/app-config/app-config';
import {
  forkJoin, Observable, of, throwError,
} from 'rxjs';
import {
  catchError, map, tap, timeout,
} from 'rxjs/operators';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { HttpStatusCodes } from '@shared/models/http-status-codes';

export type DriverLicenceDetails = (DriverLicenceSchema & { drivingLicenceNumber: string; });

export enum CandidateLicenceErr {
  OFFLINE = 'Offline and no data in cache',
  NOT_FOUND = 'Driver not found with info supplied',
  UNAVAILABLE = 'Candidate licence can\'t be returned',
  NI_LICENCE = 'Northern Irish licence detected',
}

@Injectable({
  providedIn: 'root',
})
export class CandidateLicenceProvider {

  driverLicenceResponse: DriverLicenceDetails = null;
  requestError: string = null;
  private static readonly NI_LICENCE_PATTERN: RegExp = /^\d+$/;

  constructor(
    private http: HttpClient,
    private urlProvider: UrlProvider,
    private appConfig: AppConfigProvider,
    private networkStateProvider: NetworkStateProvider,
  ) { }

  public getCandidateData = (drivingLicenceNumber: string, appRef: string): Observable<DriverLicenceSchema> => {
    // used as temporary cache, this is checked before anything else as we should either have data or an error on
    // entering the candidate-licence component
    if (this.driverLicenceResponse?.drivingLicenceNumber === drivingLicenceNumber) {
      // if data has been called for using the licence number which errored due to not being found or in-case its
      // unavailable, then don't re-query endpoint.
      if (this.requestError) {
        throw new Error(this.requestError);
      }
      return of(this.driverLicenceResponse);
    }

    // intercept call to EP when the drivingLicenceNumber is a numeric string indicating a NI licence
    if (CandidateLicenceProvider.NI_LICENCE_PATTERN.test(drivingLicenceNumber)) {
      this.requestError = CandidateLicenceErr.NI_LICENCE;
      this.driverLicenceResponse = { ...this.driverLicenceResponse, drivingLicenceNumber } as DriverLicenceDetails;
      throw new Error(CandidateLicenceErr.NI_LICENCE);
    }

    // throw offline error when no data already retained
    if (this.networkStateProvider.getNetworkState() !== ConnectionStatus.ONLINE) {
      throw new Error(CandidateLicenceErr.OFFLINE);
    }

    return forkJoin([
      this.getDriverPhoto(drivingLicenceNumber),
      this.getDriverSignature(drivingLicenceNumber),
      this.getDriverStandardData(drivingLicenceNumber, appRef),
    ]).pipe(
      map(([driverPhotograph, driverSignature, driverStandard]) => {
        // response is returned as a 200 when data exists for licence, but it can't be retrieved.
        if (('error' in driverPhotograph) || ('error' in driverSignature) || ('error' in driverStandard)) {
          this.requestError = CandidateLicenceErr.UNAVAILABLE;
          this.driverLicenceResponse = { ...this.driverLicenceResponse, drivingLicenceNumber } as DriverLicenceDetails;
          throw new Error(CandidateLicenceErr.UNAVAILABLE);
        }
        // re-shape data to be one object containing all successful endpoint data responses.
        return {
          driverPhotograph,
          driverSignature,
          driverStandard,
        } as DriverLicenceSchema;
      }),
      tap((driverDetails) => {
        this.requestError = null;
        this.driverLicenceResponse = { ...driverDetails, drivingLicenceNumber } as DriverLicenceDetails;
      }),
      catchError((errorResponse: HttpErrorResponse) => {
        // if no record found using licence number, store this so the endpoint is not re-queried for same search params;
        if (errorResponse?.status === HttpStatusCodes.NOT_FOUND) {
          this.requestError = CandidateLicenceErr.NOT_FOUND;
          this.driverLicenceResponse = { ...this.driverLicenceResponse, drivingLicenceNumber } as DriverLicenceDetails;
        }
        return throwError(() => new HttpErrorResponse(errorResponse));
      }),
    );
  };

  private getDriverPhoto = (drivingLicenceNumber: string): Observable<DriverPhotograph> => {
    return this.http.get<DriverPhotograph>(
      this.urlProvider.getCandidatePhotoUrl(drivingLicenceNumber),
    ).pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  };

  private getDriverSignature = (drivingLicenceNumber: string): Observable<DriverSignature> => {
    return this.http.get<DriverSignature>(
      this.urlProvider.getCandidateSignatureUrl(drivingLicenceNumber),
    ).pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  };

  private getDriverStandardData = (drivingLicenceNumber: string, appRef: string): Observable<DriverStandard> => {
    return this.http.post<DriverStandard>(
      this.urlProvider.getCandidateStandardDataUrl(),
      {
        drivingLicenceNumber,
        enquiryRefNumber: appRef,
      },
    ).pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  };

  clearDriverData = (): void => {
    this.driverLicenceResponse = null;
    this.requestError = null;
  };

}

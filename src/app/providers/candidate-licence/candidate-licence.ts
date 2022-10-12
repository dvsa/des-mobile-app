import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  DriverLicenceSchema, DriverPhotograph, DriverSignature, DriverStandard,
} from '@dvsa/mes-driver-schema';
import { UrlProvider } from '@providers/url/url';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { forkJoin, Observable, of } from 'rxjs';
import { map, tap, timeout } from 'rxjs/operators';
import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';

export type DriverLicenceDetails = (DriverLicenceSchema & { drivingLicenceNumber: string; });

@Injectable({
  providedIn: 'root',
})
export class CandidateLicence {

  private driverLicenceResponse: DriverLicenceDetails = null;

  constructor(
    private http: HttpClient,
    private urlProvider: UrlProvider,
    private appConfig: AppConfigProvider,
    private networkStateProvider: NetworkStateProvider,
  ) { }

  public getCandidateData = (drivingLicenceNumber: string, appRef: string): Observable<DriverLicenceSchema> => {
    // if (this.driverLicenceResponse?.drivingLicenceNumber === drivingLicenceNumber) {
    //   console.log(`Returning from in-memory cache for ${drivingLicenceNumber}`);
    //   return of(this.driverLicenceResponse);
    // }

    if (this.networkStateProvider.getNetworkState() !== ConnectionStatus.ONLINE) {
      this.driverLicenceResponse = null;
      console.error('Offline and not in cache - returning null');
      return of(null);
    }

    console.log(`Getting new data for ${drivingLicenceNumber}`);

    const mockDrivingLicenceNumber = 'LCQXD601211WI9PF';

    return forkJoin([
      this.getDriverPhoto(mockDrivingLicenceNumber),
      this.getDriverSignature(mockDrivingLicenceNumber),
      this.getDriverStandardData(mockDrivingLicenceNumber, appRef),
    ]).pipe(
      map(([driverPhotograph, driverSignature, driverStandard]) => ({
        driverPhotograph,
        driverSignature,
        driverStandard,
      } as DriverLicenceSchema)),
      tap((driverDetails) => {
        this.driverLicenceResponse = {
          ...driverDetails,
          drivingLicenceNumber,
        } as DriverLicenceDetails;
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
    console.log('Clearing candidate data');
    this.driverLicenceResponse = null;
    console.log('candidateData', this.driverLicenceResponse);
  };

}

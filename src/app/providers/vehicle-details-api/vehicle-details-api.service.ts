import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UrlProvider } from '@providers/url/url';
import { timeout } from 'rxjs/operators';
import { AppConfigProvider } from '@providers/app-config/app-config';

@Injectable({
  providedIn: 'root',
})
export class VehicleDetailsApiService {

  constructor(
    private http: HttpClient,
    public urlProvider: UrlProvider,
    public appConfig: AppConfigProvider,
  ) {
  }

  getVehicleByIdentifier(vehicleRegistration: string) {
    const headers = new HttpHeaders().set(
      'x-api-key', this.urlProvider.getTaxMotApiKey(),
    );
    const params = new HttpParams().set(
      'identifier', vehicleRegistration,
    );
    return this.http.get(
      this.urlProvider.getTaxMotUrl(), { headers, params },
    ).pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  }
}

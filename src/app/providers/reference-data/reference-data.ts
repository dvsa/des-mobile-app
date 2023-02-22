import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlProvider } from '@providers/url/url';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { TestCentre } from '@dvsa/mes-journal-schema';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

export interface RefDataTestCentreResponse {
  active: TestCentre[];
  inactive: TestCentre[];
}

@Injectable({
  providedIn: 'root',
})
export class ReferenceDataProvider {
  constructor(
    private http: HttpClient,
    private urlProvider: UrlProvider,
    private appConfig: AppConfigProvider,
  ) { }

  public getTestCentres = (): Observable<RefDataTestCentreResponse> => {
    return this.http.get<RefDataTestCentreResponse>(
      this.urlProvider.getRefDataTestCentreUrl(),
    ).pipe(timeout(this.appConfig.getAppConfig().requestTimeout));
  };

}

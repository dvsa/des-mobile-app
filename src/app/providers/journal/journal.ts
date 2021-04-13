import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExaminerWorkSchedule } from '@dvsa/mes-journal-schema';
import { Observable, from } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { DateTime } from '@shared/helpers/date-time';
import { AuthenticationProvider } from '../authentication/authentication';
import { UrlProvider } from '../url/url';
import { DataStoreProvider } from '../data-store/data-store';
import { NetworkStateProvider, ConnectionStatus } from '../network-state/network-state';
import { AppConfigProvider } from '../app-config/app-config';
import { DateTimeProvider } from '../date-time/date-time';

type JournalCache = {
  dateStored: string,
  data: ExaminerWorkSchedule,
};

@Injectable()
export class JournalProvider {
  constructor(
    public http: HttpClient,
    public urlProvider: UrlProvider,
    public authProvider: AuthenticationProvider,
    public dataStore: DataStoreProvider,
    public networkStateProvider: NetworkStateProvider,
    private appConfigProvider: AppConfigProvider,
    private dateTimeProvider: DateTimeProvider,
  ) {
  }

  getJournal(lastRefreshed: Date): Observable<ExaminerWorkSchedule> {
    const staffNumber = this.authProvider.getEmployeeId();
    const journalUrl = this.urlProvider.getPersonalJournalUrl(staffNumber);
    const networkStatus = this.networkStateProvider.getNetworkState();
    if (lastRefreshed === null) {
      if (!this.authProvider.isInUnAuthenticatedMode()
        && networkStatus === ConnectionStatus.ONLINE) {
        return this.http.get(journalUrl)
          .pipe(timeout(this.appConfigProvider.getAppConfig().requestTimeout));
      }
      return this.getOfflineJournal();
    }

    const modifiedSinceValue = lastRefreshed.toUTCString();
    const options = {
      headers: new HttpHeaders().set('If-Modified-Since', modifiedSinceValue),
    };
    if (!this.authProvider.isInUnAuthenticatedMode() && networkStatus === ConnectionStatus.ONLINE) {
      return this.http.get(journalUrl, options)
        .pipe(timeout(this.appConfigProvider.getAppConfig().requestTimeout));
    }
    return this.getOfflineJournal();
  }

  /**
   * getOfflineJournal
   * retrieves the journal from local store when network offline
   * @returns Observable
   */
  getOfflineJournal(): Observable<ExaminerWorkSchedule> {
    return from(this.getAndConvertOfflineJournal());
  }

  /**
   * getAndconvertOfflineJournal
   * retrieves the journal data or empties the cache data
   * and returns empty collection if cached data is too old
   * @returns Promise<ExaminerWorkSchedule>
   */
  getAndConvertOfflineJournal = (): Promise<ExaminerWorkSchedule> => this.dataStore.getItem('JOURNAL')
    .then((data) => {
      const journalCache: JournalCache = JSON.parse(data);
      const cachedDate = DateTime.at(journalCache.dateStored);
      if (this.isCacheTooOld(cachedDate, new DateTime())) {
        return this.emptyCachedData();
      }
      return journalCache.data;
    })
    .catch((error) => error);

  /**
   * saveJournalForOffline
   * routine to save the retrieved journal data
   * only saves the data if we have retrieved the data
   * while online
   */
  saveJournalForOffline = (journalData: ExaminerWorkSchedule) => {
    if (this.networkStateProvider.getNetworkState() === ConnectionStatus.ONLINE) {
      const journalDataToStore: JournalCache = {
        dateStored: this.dateTimeProvider.now().format('YYYY/MM/DD'),
        data: journalData,
      };
      this.dataStore.setItem('JOURNAL', JSON.stringify(journalDataToStore)).then(() => {});
    }
  };

  /**
   * isCacheTooOld
   * Helper method to determine if the cache data is too old
   * @returns boolean
   */

  isCacheTooOld = (dateStored: DateTime, now: DateTime): boolean => {
    return dateStored.daysDiff(now) > this.appConfigProvider.getAppConfig().journal.daysToCacheJournalData;
  };

  /**
   * emptyCachedData
   * overwrites the local storage with empty data
   * and returns empty collection
   */

  emptyCachedData = () => {
    const emptyJournalData: ExaminerWorkSchedule = {};
    const journalDataToStore: JournalCache = {
      dateStored: this.dateTimeProvider.now().format('YYYY/MM/DD'),
      data: emptyJournalData,
    };
    this.dataStore.setItem('JOURNAL', JSON.stringify(journalDataToStore)).then(() => {});
    return emptyJournalData;
  };

}

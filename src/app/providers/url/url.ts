import { Injectable } from '@angular/core';
import { isNil } from 'lodash';
import { AppConfigProvider } from '../app-config/app-config';

@Injectable()
export class UrlProvider {

  constructor(
    public appConfigProvider: AppConfigProvider,
  ) { }

  getPersonalJournalUrl(staffNumber: string): string {
    const urlTemplate = this.appConfigProvider.getAppConfig().journal.journalUrl;
    return urlTemplate.replace('{staffNumber}', isNil(staffNumber) ? '00000000' : staffNumber);
  }

  getLogsServiceUrl(): string {
    return this.appConfigProvider.getAppConfig().logsApiUrl;
  }

  getLogsServiceApiKey(): string {
    return this.appConfigProvider.getAppConfig().logsPostApiKey;
  }

  getTestResultServiceUrl(): string {
    return this.appConfigProvider.getAppConfig().tests.testSubmissionUrl;
  }

  getDelegatedExaminerSearchBookingUrl(applicationReference: string): string {
    const urlTemplate = this.appConfigProvider.getAppConfig().journal.delegatedExaminerSearchBookingUrl;
    return urlTemplate.replace(
      '{applicationReference}', isNil(applicationReference) ? '00000000' : applicationReference,
    );
  }

  getRekeySearchUrl(staffNumber: string): string {
    const urlTemplate = this.appConfigProvider.getAppConfig().journal.searchBookingUrl;
    return urlTemplate.replace('{staffNumber}', isNil(staffNumber) ? '00000000' : staffNumber);
  }

  getRekeyFindUserUrl(staffNumber: string): string {
    const urlTemplate = this.appConfigProvider.getAppConfig().user.findUserUrl;
    return urlTemplate.replace('{staffNumber}', isNil(staffNumber) ? '00000000' : staffNumber);
  }

}

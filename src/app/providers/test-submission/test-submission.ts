import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import {
  isNull, unset, isObject, cloneDeep,
} from 'lodash';
import { catchError, timeout } from 'rxjs/operators';
import { Observable, forkJoin, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { gzipSync } from 'zlib';
import { StoreModel } from '@shared/models/store.model';
import { LogType } from '@shared/models/log.model';
import { ActivityCodes } from '@shared/models/activity-codes';
import { SaveLog } from '@store/logs/logs.actions';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { LogHelper } from '../logs/logs-helper';
import { AppConfigProvider } from '../app-config/app-config';
import { UrlProvider } from '../url/url';

export interface TestToSubmit {
  index: number;
  slotId: string;
  payload: TestResultSchemasUnion;
  status: TestStatus;
}

@Injectable()
export class TestSubmissionProvider {

  constructor(
    public httpClient: HttpClient,
    public urlProvider: UrlProvider,
    private store$: Store<StoreModel>,
    private logHelper: LogHelper,
    private appConfig: AppConfigProvider,
  ) { }

  submitTests = (testsToSubmit: TestToSubmit[]): Observable<HttpResponse<any>[]> => {
    const requests: Observable<any>[] = testsToSubmit.map((test) => this.submitTest(test));
    return forkJoin(requests);
  };

  submitTest = (testToSubmit: TestToSubmit): Observable<HttpResponse<any> | HttpErrorResponse> => {
    // Using cloneDeep() to prevent the initialState of the reducers from being modified
    const deepClonedData = cloneDeep(testToSubmit.payload);
    const cleanData = this.removeNullFieldsDeep(
      this.removePassCompletionWhenTestIsNotPass(
        this.isPartialSubmission(testToSubmit)
          ? this.removeFieldsForPartialData(deepClonedData)
          : deepClonedData,
      ),
    );

    return this.httpClient.post(
      this.buildUrl(testToSubmit),
      this.compressData(cleanData),
      { observe: 'response' },
    )
      // Note: Catching failures here (the inner observable) is what allows us to coordinate
      // subsequent success/fail actions in sendCompletedTestsEffect$ (the outer observable)
      .pipe(
        timeout(this.appConfig.getAppConfig().requestTimeout),
        catchError((err: HttpErrorResponse) => {
          this.store$.dispatch(SaveLog({
            payload: this.logHelper
              .createLog(LogType.ERROR, `Submitting test with slot ID ${testToSubmit.slotId}`, err.message),
          }));
          return of(err);
        }),
      );
  };

  buildUrl = (testToSubmit: TestToSubmit): string => `${this.urlProvider
    .getTestResultServiceUrl()}${this.isPartialSubmission(testToSubmit) ? '?partial=true' : ''}`;

  compressData = (data: Partial<TestResultSchemasUnion>): string => gzipSync(JSON.stringify(data)).toString('base64');

  isPartialSubmission(testToSubmit: TestToSubmit): boolean {
    return testToSubmit.status === TestStatus.WriteUp && !testToSubmit.payload.rekey;
  }

  removeNullFieldsDeep = (data: Partial<TestResultSchemasUnion>): Partial<TestResultSchemasUnion> => {
    const removeNullFields = (object: Partial<TestResultSchemasUnion>) => {
      Object.keys(object).forEach((key) => {
        const value = object[key];
        if (isNull(value)) unset(object, key);
        if (isObject(value)) removeNullFields(value);
      });
      return object;
    };
    return removeNullFields(data);
  };

  // NOTE debrief witnessed and D255 should not be removed
  removeFieldsForPartialData = (data: TestResultSchemasUnion): Partial<TestResultSchemasUnion> => {
    Object.keys(data.testSummary).map((key: string) => {
      if (key !== 'debriefWitnessed' && key !== 'D255') {
        data.testSummary[key] = null;
      }
    });

    return data;
  };

  removePassCompletionWhenTestIsNotPass = (data: Partial<TestResultSchemasUnion>): Partial<TestResultSchemasUnion> => {
    if (data.activityCode !== ActivityCodes.PASS) {
      unset(data, 'passCompletion');
    }
    return data;
  };
}

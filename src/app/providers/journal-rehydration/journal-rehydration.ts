import { Injectable } from '@angular/core';
import { TestsModel } from '@store/tests/tests.model';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { get } from 'lodash-es';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { TestResultSchemasUnionWithAutosaveAndSlotID } from '@store/tests/tests.reducer';
import { catchError, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { SaveLog } from '@store/logs/logs.actions';
import { LogType } from '@shared/models/log.model';
import { LoadRemoteTests } from '@store/tests/tests.actions';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { SearchProvider } from '@providers/search/search';
import { CompressionProvider } from '@providers/compression/compression';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { LogHelper } from '@providers/logs/logs-helper';

export interface RehydrationReturn {
  test_result: TestResultSchemasUnion,
  autosave: number
}

@Injectable()
export class JournalRehydrationProvider {

  constructor(
    private searchProvider: SearchProvider,
    private compressionProvider: CompressionProvider,
    private store$: Store<StoreModel>,
    private logHelper: LogHelper
  ) { }

  makeRehydrationNetworkCall(testsThatNeedRehydrated: any[], employeeId: string) {
    let completedTestsWithAutoSaveAndID: TestResultSchemasUnionWithAutosaveAndSlotID[] = [];
    //Get the app refs that need rehydrated from the backend
    this.searchProvider
      .getTestResults(testsThatNeedRehydrated.map(value =>
        value.appRef.toString()), employeeId
      )
      .pipe(
        map((response: HttpResponse<any>): string => response.body),
        //Decompress data
        map((data) => (this.compressionProvider.extract<RehydrationReturn[]>(data))),
        map((tests) => {
          //Find which test this is referencing, so we can take its details
          tests.forEach((test) => {
            let currentTest = testsThatNeedRehydrated.find((value) => {
              return (value.appRef == formatApplicationReference(test.test_result.journalData.applicationReference));
            });
              //Push the test details to the array, so it can be dispatched to the state
            completedTestsWithAutoSaveAndID.push({
              autosave: !!test.autosave,
              testData: test.test_result,
              slotId: currentTest.slotId.toString(),
            });
          });
          return of();
        }),
        catchError(async (err) => {
          //Error handling
          this.store$.dispatch(SaveLog({
            payload: this.logHelper.createLog(
              LogType.ERROR,
              `Getting test results (${testsThatNeedRehydrated.map(value => value.appRef.toString())})`,
              err,
            ),
          }));
          return of();
        }),
      ).subscribe(() => {
        if (completedTestsWithAutoSaveAndID.length > 0) {
          //Dispatch tests so they can be loaded into the local store
          this.store$.dispatch(LoadRemoteTests(completedTestsWithAutoSaveAndID));
        }
      });
  }

  hasRehydratableTestStatus(slotID: number, testsModel: TestsModel) {
    return !isAnyOf(testsModel.testStatus[slotID], [
      TestStatus.WriteUp,
      TestStatus.Autosaved,
      TestStatus.Completed,
      TestStatus.Submitted
    ])
  }

  async rehydrateTests(testsModel: TestsModel, testSlots: SlotItem[], employeeId: string) {

    //Get a list of every test slot that doesn't have a test status or has one that should be overwritten by rehydration
    let testsThatNeedRehydrated = testSlots
      .filter(value => (get(value, 'slotData.booking'))
        && (!(testsModel.testStatus[value.slotData.slotDetail.slotId]) ||
          this.hasRehydratableTestStatus(value.slotData.slotDetail.slotId, testsModel)
        ))
      .map(value => {
        //Return the slot ID and the application reference for the values in testSlots
        return({
          slotId: value.slotData.slotDetail.slotId,
          appRef: formatApplicationReference(
            {
              applicationId: (value.slotData as TestSlot).booking.application.applicationId,
              bookingSequence: (value.slotData as TestSlot).booking.application.bookingSequence,
              checkDigit: (value.slotData as TestSlot).booking.application.checkDigit
            }
          ),
        });
      })
    //If testsThatNeedRehydrated has items in it, we need to get the test result from the backend
    if (testsThatNeedRehydrated.length > 0) {
      this.makeRehydrationNetworkCall(testsThatNeedRehydrated, employeeId)
    }
  }
}

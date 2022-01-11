import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
} from '@ngrx/effects';
import { from, of, interval } from 'rxjs';
import { Store, select, Action } from '@ngrx/store';
import {
  find, startsWith, omit, has,
} from 'lodash';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  Examiner,
  TestSlotAttributes,
  ConductedLanguage,
  CategoryCode,
} from '@dvsa/mes-test-schema/categories/common';
import {
  switchMap, catchError, filter, map, withLatestFrom, concatMap,
} from 'rxjs/operators';

import { ConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { TestSubmissionProvider, TestToSubmit } from '@providers/test-submission/test-submission';
import { TestPersistenceProvider } from '@providers/test-persistence/test-persistence';
import { getRekeySearchState, RekeySearchModel } from '@pages/rekey-search/rekey-search.reducer';
import { getBookedTestSlot } from '@pages/rekey-search/rekey-search.selector';
import {
  getBookedTestSlot as getDelegatedBookedTestSlot,
} from '@pages/delegated-rekey-search/delegated-rekey-search.selector';
import {
  DelegatedRekeySearchModel,
  getDelegatedRekeySearchState,
} from '@pages/delegated-rekey-search/delegated-rekey-search.reducer';
import { version } from '@environments/test-schema-version';
import { StoreModel } from '@shared/models/store.model';
import { end2endPracticeSlotId, testReportPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import { HttpStatusCodes } from '@shared/models/http-status-codes';
import { selectVersionNumber } from '@store/app-info/app-info.selectors';
import { IndependentDrivingTypeChanged, RouteNumberChanged } from '@store/tests/test-summary/test-summary.actions';
import { NavigationStateProvider } from '@providers/navigation-state/navigation-state';
import * as testActions from './tests.actions';
import * as testStatusActions from './test-status/test-status.actions';
import {
  PopulateApplicationReference,
} from './journal-data/common/application-reference/application-reference.actions';
import { PopulateCandidateDetails } from './journal-data/common/candidate/candidate.actions';
import { testReportPracticeModeSlot } from './__mocks__/tests.mock';
import { getTests } from './tests.reducer';
import {
  getCurrentTest,
  isPracticeMode,
  getCurrentTestSlotId,
  getCurrentTestStatus,
} from './tests.selector';
import { TestStatus } from './test-status/test-status.model';
import { TestsModel } from './tests.model';
import { getJournalState } from '../journal/journal.reducer';
import { getSlotsOnSelectedDate } from '../journal/journal.selector';
import { PopulateExaminer } from './journal-data/common/examiner/examiner.actions';
import { PopulateTestSlotAttributes } from './journal-data/common/test-slot-attributes/test-slot-attributes.actions';
import { extractTestSlotAttributes } from './journal-data/common/test-slot-attributes/test-slot-attributes.selector';
import { PopulateTestCentre } from './journal-data/common/test-centre/test-centre.actions';
import { extractTestCentre } from './journal-data/common/test-centre/test-centre.selector';
import { PopulateTestCategory } from './category/category.actions';
import { PopulateTestSchemaVersion } from './schema-version/schema-version.actions';
import { SetExaminerBooked } from './examiner-booked/examiner-booked.actions';
import { SetExaminerConducted } from './examiner-conducted/examiner-conducted.actions';
import { SetExaminerKeyed } from './examiner-keyed/examiner-keyed.actions';
import { MarkAsRekey } from './rekey/rekey.actions';
import { PopulateAppVersion } from './app-version/app-version.actions';
import { JournalModel } from '../journal/journal.model';
import { PopulateConductedLanguage } from './communication-preferences/communication-preferences.actions';
import { Language } from './communication-preferences/communication-preferences.model';
import { StartDelegatedTest } from './delegated-test/delegated-test.actions';
import { OtherReasonUpdated, OtherSelected } from './rekey-reason/rekey-reason.actions';
import { getStaffNumber } from './journal-data/common/examiner/examiner.selector';
import {
  SendCompletedTests,
  StartTest,
  TestActionsTypes,
} from './tests.actions';
import { createPopulateCandidateDetailsAction } from './journal-data/common/candidate/candidate.action-creator';
import { GearboxCategoryChanged, PopulateVehicleDimensions } from './vehicle-details/vehicle-details.actions';
import {
  InitialiseVehicleChecks as InitialiseVehicleChecksCatC, SetFullLicenceHeld,
} from './test-data/cat-c/vehicle-checks/vehicle-checks.cat-c.action';
import {
  InitializeVehicleChecks as InitializeVehicleChecksCatD,
}
  from './test-data/cat-d/vehicle-checks/vehicle-checks.cat-d.action';

@Injectable()
export class TestsEffects {
  constructor(
    private actions$: Actions,
    private testPersistenceProvider: TestPersistenceProvider,
    private testSubmissionProvider: TestSubmissionProvider,
    private appConfigProvider: AppConfigProvider,
    private networkStateProvider: NetworkStateProvider,
    private store$: Store<StoreModel>,
    public authenticationProvider: AuthenticationProvider,
    private navigationStateProvider: NavigationStateProvider,
  ) {
  }

  persistTestsEffect$ = createEffect(() => this.actions$.pipe(
    ofType(testActions.PersistTests),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
          this.store$.pipe(
            select(getTests),
            select(isPracticeMode),
          ),
        ),
      )),
    filter(([, , practiceMode]) => !practiceMode),
    switchMap(([, tests]) => {
      return this.testPersistenceProvider.persistTests(this.getSaveableTestsObject(tests));
    }),
    catchError((err) => {
      console.log(`Error persisting tests: ${err}`);
      return of();
    }),
  ), { dispatch: false });

  getSaveableTestsObject(tests: TestsModel): TestsModel {
    const testsNotToSave = Object.keys(tests.startedTests)
      .filter((key) => {
        return startsWith(key, testReportPracticeSlotId) || startsWith(key, end2endPracticeSlotId);
      });

    return {
      currentTest: {
        slotId: testsNotToSave.includes(tests.currentTest.slotId) ? null : tests.currentTest.slotId,
      },
      startedTests: omit(tests.startedTests, testsNotToSave),
      testStatus: omit(tests.testStatus, testsNotToSave),
    };
  }

  loadPersistedTestsEffect$ = createEffect(() => this.actions$.pipe(
    ofType(testActions.LoadPersistedTests),
    switchMap(() => from(this.testPersistenceProvider.loadPersistedTests())
      .pipe(
        filter((testsModel) => testsModel !== null),
        map((testsModel) => testActions.LoadPersistedTestsSuccess(testsModel)),
        catchError((err) => {
          console.log(`Error reading persisted tests: ${err}`);
          return of(testActions.LoadPersistedTestsFailure());
        }),
      )),
  ));

  startTestEffect$ = createEffect(() => this.actions$.pipe(
    ofType(testActions.StartTest),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getJournalState),
          ),
          this.store$.pipe(
            select(getRekeySearchState),
          ),
          this.store$.pipe(
            select(getDelegatedRekeySearchState),
          ),
          this.store$.pipe(
            select(selectVersionNumber),
          ),
        ),
      )),
    switchMap(([action, journal, rekeySearch, delegatedRekeySearch, appVersion]:
    [TestActionsTypes, JournalModel, RekeySearchModel, DelegatedRekeySearchModel, string]) => {
      const startTestAction = action as ReturnType<typeof StartTest>;
      const isRekeySearch = this.navigationStateProvider.isRekeySearch();
      const isDelegatedRekeySearch = this.navigationStateProvider.isDelegatedExaminerRekeySearch();
      const employeeId = this.authenticationProvider.getEmployeeId() || journal.examiner.staffNumber;

      let slot: TestSlot;
      let examiner: Examiner;

      const examinerKeyed: string = employeeId;

      let examinerBooked: string;

      if (isDelegatedRekeySearch) {
        slot = getDelegatedBookedTestSlot(delegatedRekeySearch);
        examiner = {
          staffNumber: slot['examinerId'],
        };
      } else if (isRekeySearch) {
        examinerBooked = getStaffNumber(rekeySearch);
        examiner = {
          staffNumber: examinerBooked,
        };
        slot = getBookedTestSlot(rekeySearch);
      } else {
        examinerBooked = journal.examiner.staffNumber;
        examiner = journal.examiner;
        const slots = getSlotsOnSelectedDate(journal);
        const slotData = slots.map((s) => s.slotData);
        slot = slotData.find((data) => data.slotDetail.slotId === startTestAction.slotId && has(data, 'booking'));
      }
      const testSlotAttributes: TestSlotAttributes = extractTestSlotAttributes(slot);
      const conductedLanguage: ConductedLanguage = testSlotAttributes.welshTest ? Language.CYMRAEG : Language.ENGLISH;

      const arrayOfActions: Action[] = [
        PopulateTestCategory(startTestAction.category),
        PopulateExaminer(examiner),
        PopulateApplicationReference(slot.booking.application),
        createPopulateCandidateDetailsAction(startTestAction.category, slot.booking),
        PopulateTestSlotAttributes(testSlotAttributes),
        PopulateTestCentre(extractTestCentre(slot)),
        testStatusActions.SetTestStatusBooked(startTestAction.slotId.toString()),
        SetExaminerBooked(parseInt(examinerBooked, 10) ? parseInt(examinerBooked, 10) : null),
        SetExaminerConducted(parseInt(examinerBooked, 10) ? parseInt(examinerBooked, 10) : null),
        SetExaminerKeyed(parseInt(examinerKeyed, 10) ? parseInt(examinerKeyed, 10) : null),
        PopulateConductedLanguage(conductedLanguage),
        PopulateTestSchemaVersion(version),
        PopulateAppVersion(appVersion),
      ];

      if (startTestAction.category !== TestCategory.B && startTestAction.category !== TestCategory.ADI2) {
        arrayOfActions.push(PopulateVehicleDimensions(
          slot.booking.application.vehicleWidth,
          slot.booking.application.vehicleLength,
        ));
      }
      if (startTestAction.rekey) {
        arrayOfActions.push(MarkAsRekey());
      }
      if (startTestAction.delegatedTest) {
        arrayOfActions.push(StartDelegatedTest());
        arrayOfActions.push(OtherSelected(true));
        arrayOfActions.push(OtherReasonUpdated('Delegated Examiner'));
      }
      if (
        startTestAction.category === TestCategory.C
        || startTestAction.category === TestCategory.C1
        || startTestAction.category === TestCategory.C1E
        || startTestAction.category === TestCategory.CE) {
        arrayOfActions.push(InitialiseVehicleChecksCatC(startTestAction.category));
      }
      if (
        startTestAction.category === TestCategory.D
        || startTestAction.category === TestCategory.D1
        || startTestAction.category === TestCategory.D1E
        || startTestAction.category === TestCategory.DE) {
        arrayOfActions.push(InitializeVehicleChecksCatD(startTestAction.category));
      }
      if (
        startTestAction.category === TestCategory.C
        || startTestAction.category === TestCategory.C1
        || startTestAction.category === TestCategory.D
        || startTestAction.category === TestCategory.D1
      ) {
        arrayOfActions.push(SetFullLicenceHeld(false));
      }
      if (
        startTestAction.category === TestCategory.F
        || startTestAction.category === TestCategory.G
        || startTestAction.category === TestCategory.H
        || startTestAction.category === TestCategory.K) {
        arrayOfActions.push(GearboxCategoryChanged('Manual'));
        arrayOfActions.push(RouteNumberChanged(88));
        arrayOfActions.push(IndependentDrivingTypeChanged('N/A'));
      }
      return arrayOfActions;
    }),
  ));

  activateTestEffect$ = createEffect(() => this.actions$.pipe(
    ofType(testActions.ActivateTest),
    filter((action) => action.rekey),
    map((action) => {
      const activateTestAction = action as ReturnType<typeof testActions.ActivateTest>;
      if (activateTestAction.rekey) {
        return MarkAsRekey();
      }
    }),
  ));

  startPracticeTestEffect$ = createEffect(() => this.actions$.pipe(
    ofType(testActions.StartTestReportPracticeTest),
    switchMap(() => {
      const slotData = {
        ...testReportPracticeModeSlot,
      };

      return [
        PopulateTestCategory(slotData.booking.application.testCategory as CategoryCode),
        PopulateApplicationReference(slotData.booking.application),
        PopulateCandidateDetails(slotData.booking.candidate),
      ];
    }),
  ));

  startSendingCompletedTestsEffect$ = createEffect(() => this.actions$.pipe(
    ofType(testActions.StartSendingCompletedTests),
    switchMap(() => {
      return interval(this.appConfigProvider.getAppConfig().tests.autoSendInterval)
        .pipe(
          map(() => testActions.SendCompletedTests()),
        );
    }),
  ));

  sendPartialTest$ = createEffect(() => this.actions$.pipe(
    ofType(testStatusActions.SetTestStatusWriteUp),
    map(() => testActions.SendCompletedTests()),
  ));

  sendCompletedTestsEffect$ = createEffect(() => this.actions$.pipe(
    ofType(testActions.SendCompletedTests),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
        ),
      )),
    filter(() => this.networkStateProvider.getNetworkState() === ConnectionStatus.ONLINE),
    switchMap(([, tests]: [ReturnType<typeof SendCompletedTests>, TestsModel]) => {

      const completedTestKeys = Object.keys(tests.testStatus)
        .filter((slotId: string) =>
          slotId !== testReportPracticeSlotId
          && !startsWith(slotId, end2endPracticeSlotId)
          && (tests.testStatus[slotId] === TestStatus.Completed || tests.testStatus[slotId] === TestStatus.WriteUp)
          && !tests.startedTests[slotId].rekey);

      const completedTests: TestToSubmit[] = completedTestKeys.map((slotId: string, index: number) => ({
        index,
        slotId,
        payload: tests.startedTests[slotId],
        status: tests.testStatus[slotId],
      }));

      if (completedTests.length === 0) {
        return of(testActions.SendCompletedNoneSent());
      }

      return this.testSubmissionProvider.submitTests(completedTests)
        .pipe(
          switchMap((responses: HttpResponse<any>[]) => {
            return responses.map((response, index) => {
              const matchedTests = find(completedTests, ['index', index]);
              if (response.status === HttpStatusCodes.CREATED) {
                return matchedTests.status === TestStatus.WriteUp
                  ? testActions.SendPartialTestSuccess(matchedTests.slotId)
                  : testActions.SendCompletedTestSuccess(matchedTests.slotId);
              }
              return matchedTests.status === TestStatus.WriteUp
                ? testActions.SendPartialTestsFailure()
                : testActions.SendCompletedTestsFailure();
            });
          }),
        );
    }),
  ));

  sendPartialTestSuccessEffect$ = createEffect(() => this.actions$.pipe(
    ofType(testActions.SendPartialTestSuccess),
    switchMap((action) => {
      return [
        testStatusActions.SetTestStatusAutosaved(action.payload),
        testActions.PersistTests(),
      ];
    }),
  ));

  sendCompletedTestsSuccessEffect$ = createEffect(() => this.actions$.pipe(
    ofType(testActions.SendCompletedTestSuccess),
    switchMap((action) => {
      return [
        testStatusActions.SetTestStatusSubmitted(action.payload),
        testActions.PersistTests(),
      ];
    }),
  ));

  setTestStatusCompletedEffect$ = createEffect(() => this.actions$.pipe(
    ofType(testStatusActions.SetTestStatusCompleted),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
            select(getCurrentTest),
          ),
        ),
      )),
    map(([,]) => testActions.SendCompletedTests()),
  ));

  sendCurrentTestEffect$ = createEffect(() => this.actions$.pipe(
    ofType(testActions.SendCurrentTest),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
          ),
        ),
      )),
    switchMap(([, tests]: [testActions.TestActionsTypes, TestsModel]) => {
      const slotId = getCurrentTestSlotId(tests);
      const test = getCurrentTest(tests);
      const testStatus = getCurrentTestStatus(tests);

      const testToSubmit: TestToSubmit = {
        slotId,
        index: 0,
        payload: test,
        status: testStatus,
      };

      return this.testSubmissionProvider.submitTest(testToSubmit)
        .pipe(
          map((response: HttpResponse<any> | HttpErrorResponse) => {
            if (response.status === HttpStatusCodes.CREATED) {
              return testActions.SendCurrentTestSuccess();
            }
            return testActions.SendCurrentTestFailure(response.status === HttpStatusCodes.CONFLICT);
          }),
        );
    }),
  ));

  sendCurrentTestSuccessEffect$ = createEffect(() => this.actions$.pipe(
    ofType(testActions.SendCurrentTestSuccess),
    concatMap((action) => of(action)
      .pipe(
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
            select(getCurrentTestSlotId),
          ),
        ),
      )),
    switchMap(([, slotId]: [testActions.TestActionsTypes, string]) => {
      return [
        testStatusActions.SetTestStatusSubmitted(slotId),
        testActions.PersistTests(),
      ];
    }),
  ));

}

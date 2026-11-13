import { TestBed } from '@angular/core/testing';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import * as delegatedRekeySearchActions from '@pages/delegated-rekey-search/delegated-rekey-search.actions';
import { delegatedSearchReducer } from '@pages/delegated-rekey-search/delegated-rekey-search.reducer';
import * as rekeySearchActions from '@pages/rekey-search/rekey-search.actions';
import { rekeySearchReducer } from '@pages/rekey-search/rekey-search.reducer';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { NavigationStateProviderMock } from '@providers/navigation-state/__mocks__/navigation-state.mock';
import { NavigationStateProvider } from '@providers/navigation-state/navigation-state';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import { NetworkConnectionStatus, NetworkStateProvider } from '@providers/network-state/network-state';
import { TestPersistenceProviderMock } from '@providers/test-persistence/__mocks__/test-persistence.mock';
import { TestPersistenceProvider } from '@providers/test-persistence/test-persistence';
import { TestSubmissionProviderMock } from '@providers/test-submission/__mocks__/test-submission.mock';
import { TestSubmissionProvider } from '@providers/test-submission/test-submission';
import { DateTime } from '@shared/helpers/date-time';
import { StoreModel } from '@shared/models/store.model';
import { appInfoReducer } from '@store/app-info/app-info.reducer';
import journalSlotsDataMock from '@store/journal/__mocks__/journal-slots-data.mock';
import * as journalActions from '@store/journal/journal.actions';
import { journalReducer } from '@store/journal/journal.reducer';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { bufferCount } from 'rxjs/operators';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { unitTestErrorCause } from '../../../test-setup.vitest';
import { candidateMock, testApplicationMock, testReportPracticeModeSlot } from '../__mocks__/tests.mock';
import { PopulateTestCategory } from '../category/category.actions';
import { StartDelegatedTest } from '../delegated-test/delegated-test.actions';
import { SetExaminerBooked } from '../examiner-booked/examiner-booked.actions';
import { SetExaminerConducted } from '../examiner-conducted/examiner-conducted.actions';
import { SetExaminerKeyed } from '../examiner-keyed/examiner-keyed.actions';
import { PopulateApplicationReference } from '../journal-data/common/application-reference/application-reference.actions';
import { PopulateCandidateDetails } from '../journal-data/common/candidate/candidate.actions';
import { PopulateExaminer } from '../journal-data/common/examiner/examiner.actions';
import { OtherReasonUpdated, OtherSelected } from '../rekey-reason/rekey-reason.actions';
import * as rekeyActions from '../rekey/rekey.actions';
import * as testStatusActions from '../test-status/test-status.actions';
import * as testsActions from '../tests.actions';
import { TestsEffects } from '../tests.effects';
import { TestsModel } from '../tests.model';
import { initialState, testsReducer } from '../tests.reducer';

const selectedDateForSlot = (slotId: number): string => {
  const slot = Object.values(journalSlotsDataMock)
    .flat()
    .find(({ slotData }) => slotData.slotDetail.slotId === slotId);

  if (!slot) {
    throw new Error(`Journal fixture does not contain slot ${slotId}`, { cause: unitTestErrorCause });
  }

  return DateTime.at(slot.slotData.slotDetail.start).format('YYYY-MM-DD');
};

describe('TestsEffects', () => {
  let effects: TestsEffects;
  let actions$: ReplaySubject<Action>;
  let testPersistenceProviderMock: TestPersistenceProvider;
  let store$: Store<StoreModel>;
  let logHelper: LogHelper;
  let navigationStateProviderMock: NavigationStateProviderMock;
  let authenticationProviderMock: AuthenticationProvider;
  const testSlot: TestSlot = {
    slotDetail: {
      slotId: 4363463,
    },
    testCentre: {
      centreId: 54321,
      centreName: 'Example Test Centre',
      costCode: 'EXTC1',
    },
    booking: {
      application: {
        applicationId: 12345,
        bookingSequence: 11,
        checkDigit: 1,
        testCategory: TestCategory.B,
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          journal: journalReducer,
          tests: testsReducer,
          rekeySearch: rekeySearchReducer,
          delegatedRekeySearch: delegatedSearchReducer,
          appInfo: appInfoReducer,
        }),
      ],
      providers: [
        TestsEffects,
        provideMockActions(() => actions$),
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        {
          provide: TestPersistenceProvider,
          useClass: TestPersistenceProviderMock,
        },
        {
          provide: TestSubmissionProvider,
          useClass: TestSubmissionProviderMock,
        },
        {
          provide: NetworkStateProvider,
          useClass: NetworkStateProviderMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: NavigationStateProvider,
          useClass: NavigationStateProviderMock,
        },
        {
          provide: LogHelper,
          useClass: LogHelperMock,
        },
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(TestsEffects);
    testPersistenceProviderMock = TestBed.inject(TestPersistenceProvider);
    authenticationProviderMock = TestBed.inject(AuthenticationProvider);
    navigationStateProviderMock = TestBed.inject(NavigationStateProvider);
    store$ = TestBed.inject(Store);
    logHelper = TestBed.inject(LogHelper);
    vi.spyOn(logHelper, 'createLog');
    vi.spyOn(testPersistenceProviderMock, 'persistTests').mockReturnValue(Promise.resolve(''));
    vi.spyOn(testPersistenceProviderMock, 'loadPersistedTests').mockReturnValue(Promise.resolve({} as TestsModel));
  });

  describe('persistTestsEffect', () => {
    it('should respond to a PERSIST_TESTS action and delegate to the persistence provider', async () => {
      await new Promise<void>((done, reject) => {
        // ARRANGE
        store$.dispatch(testsActions.StartTest(12345, TestCategory.B));
        vi.spyOn(testPersistenceProviderMock, 'persistTests').mockReturnValue(Promise.resolve(''));
        // ACT
        actions$.next(testsActions.PersistTests());
        // ASSERT
        effects.persistTestsEffect$.subscribe(() => {
          try {
            expect(testPersistenceProviderMock.persistTests).toHaveBeenCalled();
            done();
          } catch (error) {
            reject(error);
          }
        }, reject);
      });
    });
  });

  describe('loadPersistedTestsEffect', () => {
    it('should respond to a LOAD_PERSISTED_TESTS action by loading tests and dispatching a success action', async () => {
      const persistedTests: TestsModel = {
        ...initialState,
        currentTest: {
          ...initialState.currentTest,
          slotId: '123',
        },
      };
      vi.spyOn(testPersistenceProviderMock, 'loadPersistedTests').mockReturnValue(Promise.resolve(persistedTests));
      actions$.next(testsActions.LoadPersistedTests());
      const emission = await firstValueFrom(effects.loadPersistedTestsEffect$);
      expect(testPersistenceProviderMock.loadPersistedTests).toHaveBeenCalled();
      expect(emission).toEqual(testsActions.LoadPersistedTestsSuccess(persistedTests));
    });
  });

  describe('startPracticeTestEffect', () => {
    it('should dispatch the PopulateApplicationReference and PopulateCandidateDetails action', () => {
      // ACT
      actions$.next(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      // ASSERT
      effects.startPracticeTestEffect$.subscribe((result) => {
        if (result.type === PopulateApplicationReference.type) {
          expect(result).toEqual(PopulateApplicationReference(testApplicationMock));
        }
        if (result.type === PopulateCandidateDetails.type) {
          expect(result).toEqual(PopulateCandidateDetails(candidateMock));
        }
      });
    });
  });

  describe('sendCompletedTestsEffect', () => {
    it('should dispatch use the order of the responses to coordinate subsequent dispatching of actions', () => {
      // ARRANGE
      // Adds three tests as 'Completed' for the sendCompletedTestsEffect to consume
      // The http responses are mocked in test-submission.mock.ts
      const currentTestSlotId = '12345'; // Mocked as a 201 http response
      const currentTestSlotId1 = '123456'; // Mocked as a 201 http response
      const currentTestSlotId2 = '1234567'; // Mocked as a 500 http error response
      store$.dispatch(testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
      store$.dispatch(testStatusActions.SetTestStatusCompleted(testReportPracticeModeSlot.slotDetail.slotId));
      store$.dispatch(testsActions.StartTest(Number(currentTestSlotId), TestCategory.B));
      store$.dispatch(testStatusActions.SetTestStatusCompleted(currentTestSlotId));
      store$.dispatch(testsActions.StartTest(Number(currentTestSlotId1), TestCategory.B));
      store$.dispatch(testStatusActions.SetTestStatusCompleted(currentTestSlotId1));
      store$.dispatch(testsActions.StartTest(Number(currentTestSlotId2), TestCategory.B));
      store$.dispatch(testStatusActions.SetTestStatusCompleted(currentTestSlotId2));
      // ACT
      actions$.next(testsActions.SendCompletedTests());
      // ASSERT
      effects.sendCompletedTestsEffect$.subscribe((result) => {
        if (result.type === testsActions.SendCompletedTestSuccess.type) {
          if (result.payload === currentTestSlotId) {
            expect(result).toEqual(testsActions.SendCompletedTestSuccess(currentTestSlotId, TestStatus.Completed));
          }
          if (result.payload === currentTestSlotId1) {
            expect(result).toEqual(testsActions.SendCompletedTestSuccess(currentTestSlotId1, TestStatus.Completed));
          }
          if (result.payload === currentTestSlotId2) {
            expect(result.type).toEqual(testsActions.SendCompletedTestsFailure().type);
          }
          if (result.payload === testReportPracticeModeSlot.slotDetail.slotId) {
            throw new Error('Practice test should not be submitted', { cause: unitTestErrorCause });
          }
        }
      });
    });
  });

  describe('sendCurrentTestSuccessEffect', () => {
    it('should dispatch the TestStatusSubmitted action', () => {
      const currentTestSlotId = '12345';
      store$.dispatch(testsActions.StartTest(12345, TestCategory.B));
      // ACT
      actions$.next(testsActions.SendCurrentTestSuccess());
      // ASSERT
      effects.sendCurrentTestSuccessEffect$.subscribe((result) => {
        if (result.type === testStatusActions.SetTestStatusSubmitted.type) {
          expect(result).toEqual(testStatusActions.SetTestStatusSubmitted(currentTestSlotId));
        }
        if (result.type === testsActions.PersistTests.type) {
          expect(result).toEqual(testsActions.PersistTests());
        }
      });
    });
  });

  describe('startTestEffect$', () => {
    it('should copy the examiner from the journal state into the test state', async () => {
      await new Promise<void>((done, reject) => {
        const selectedDate = selectedDateForSlot(1001);
        const examiner = {
          staffNumber: '123',
          individualId: 456,
        };
        store$.dispatch(journalActions.SetSelectedDate(selectedDate));
        store$.dispatch(
          journalActions.LoadJournalSuccess(
            {
              examiner,
              slotItemsByDate: journalSlotsDataMock,
            },
            NetworkConnectionStatus.ONLINE,
            false,
            new Date()
          )
        ); // Load in mock journal state
        // ACT
        actions$.next(testsActions.StartTest(1001, TestCategory.B));
        // ASSERT
        effects.startTestEffect$.pipe(bufferCount(13)).subscribe(([, res1, , , , , , res7, res8, res9]) => {
          try {
            expect(res1).toEqual(PopulateExaminer(examiner));
            expect(res7).toEqual(SetExaminerBooked(Number.parseInt(examiner.staffNumber, 10)));
            expect(res8).toEqual(SetExaminerConducted(Number.parseInt(examiner.staffNumber, 10)));
            expect(res9).toEqual(SetExaminerKeyed(Number.parseInt(authenticationProviderMock.getEmployeeId(), 10)));
            done();
          } catch (error) {
            reject(error);
          }
        }, reject);
      });
    });

    it('should mark the test as a rekey when this is a rekey', async () => {
      await new Promise<void>((done, reject) => {
        const selectedDate = selectedDateForSlot(1001);
        const examiner = {
          staffNumber: '123',
          individualId: 456,
        };
        store$.dispatch(journalActions.SetSelectedDate(selectedDate));
        store$.dispatch(
          journalActions.LoadJournalSuccess(
            {
              examiner,
              slotItemsByDate: journalSlotsDataMock,
            },
            NetworkConnectionStatus.ONLINE,
            false,
            new Date()
          )
        ); // Load in mock journal state
        // ACT
        actions$.next(testsActions.StartTest(1001, TestCategory.B, true));
        // ASSERT
        effects.startTestEffect$
          .pipe(bufferCount(14))
          .subscribe(([, res1, , , , , , res7, res8, res9, , , , res13]) => {
            try {
              expect(res1).toEqual(PopulateExaminer(examiner));
              expect(res7).toEqual(SetExaminerBooked(Number.parseInt(examiner.staffNumber, 10)));
              expect(res8).toEqual(SetExaminerConducted(Number.parseInt(examiner.staffNumber, 10)));
              expect(res9).toEqual(SetExaminerKeyed(Number.parseInt(authenticationProviderMock.getEmployeeId(), 10)));
              expect(res13).toEqual(rekeyActions.MarkAsRekey());
              done();
            } catch (error) {
              reject(error);
            }
          }, reject);
      });
    });

    it('should get the slot from booked slots when this is a rekey test started from the rekey search', async () => {
      await new Promise<void>((done, reject) => {
        vi.spyOn(navigationStateProviderMock, 'isRekeySearch').mockReturnValue(true);
        const staffNumber = '654321';
        store$.dispatch(rekeySearchActions.SearchBookedTestSuccess(testSlot, staffNumber));
        // ACT
        actions$.next(testsActions.StartTest(1001, testSlot.booking.application.testCategory as TestCategory, true));
        // ASSERT
        effects.startTestEffect$
          .pipe(bufferCount(14))
          .subscribe(([res0, res1, res2, res3, , , , res7, res8, res9, , , , res13]) => {
            try {
              expect(res0).toEqual(PopulateTestCategory(testSlot.booking.application.testCategory as CategoryCode));
              expect(res1).toEqual(PopulateExaminer({ staffNumber }));
              expect(res2).toEqual(PopulateApplicationReference(testSlot.booking.application));
              expect(res3).toEqual(PopulateCandidateDetails(testSlot.booking.candidate));
              expect(res7).toEqual(SetExaminerBooked(Number.parseInt(staffNumber, 10)));
              expect(res8).toEqual(SetExaminerConducted(Number.parseInt(staffNumber, 10)));
              expect(res9).toEqual(SetExaminerKeyed(Number.parseInt(authenticationProviderMock.getEmployeeId(), 10)));
              expect(res13).toEqual(rekeyActions.MarkAsRekey());
              done();
            } catch (error) {
              reject(error);
            }
          }, reject);
      });
    });

    it('should set the rekey reason and reason correctly when it is a delegated examiner test', async () => {
      vi.useFakeTimers();
      try {
        vi.spyOn(navigationStateProviderMock, 'isDelegatedExaminerRekeySearch').mockReturnValue(true);
        store$.dispatch(delegatedRekeySearchActions.SearchBookedDelegatedTestSuccess(testSlot));
        // ACT
        actions$.next(testsActions.StartTest(1001, TestCategory.B, false, true));
        // ASSERT
        effects.startTestEffect$
          .pipe(bufferCount(17))
          .subscribe(([, , , , , , , , , , , , , , res13, res14, res15]) => {
            expect(res13).toEqual(StartDelegatedTest());
            expect(res14).toEqual(OtherSelected(true));
            expect(res15).toEqual(OtherReasonUpdated('Delegated Examiner'));
          });
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('activateTestEffect', () => {
    it('should call theMarkAsRekey action', async () => {
      actions$.next(testsActions.ActivateTest(1234, TestCategory.B, true));
      const result = await firstValueFrom(effects.activateTestEffect$);
      expect(result.type).toEqual(rekeyActions.MarkAsRekey.type);
    });
  });

  describe('sendPartialTest', () => {
    it('should call the ', async () => {
      actions$.next(testStatusActions.SetTestStatusWriteUp('123'));
      const result = await firstValueFrom(effects.sendPartialTest$);
      expect(result.type).toEqual(testsActions.SendCompletedTests.type);
    });
  });
});

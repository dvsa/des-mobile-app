// import { TestsEffects } from '../tests.effects';
// import { ReplaySubject } from 'rxjs';
// import { TestPersistenceProvider } from '../../../providers/test-persistence/test-persistence';
// import { TestBed } from '@angular/core/testing';
// import { provideMockActions } from '@ngrx/effects/testing';
// import { TestPersistenceProviderMock } from '../../../providers/test-persistence/__mocks__/test-persistence.mock';
// import * as testsActions from '../tests.actions';
// import * as testStatusActions from '../test-status/test-status.actions';
// import * as rekeyActions from '../rekey/rekey.actions';
// import * as journalActions from '../../../modules/journal/journal.actions';
// import { TestsModel } from '../tests.model';
// import { PopulateApplicationReference }
//   from '../journal-data/common/application-reference/application-reference.actions';
// import { PopulateCandidateDetails } from '../journal-data/common/candidate/candidate.actions';
// import {
//   testApplicationMock,
//   candidateMock,
//   testReportPracticeModeSlot,
// } from '../__mocks__/tests.mock';
// import { initialState, testsReducer } from '../tests.reducer';
// import { TestSubmissionProvider } from '../../../providers/test-submission/test-submission';
// import { TestSubmissionProviderMock } from '../../../providers/test-submission/__mocks__/test-submission.mock';
// import { Store, StoreModule } from '@ngrx/store';
// import { NetworkStateProvider, ConnectionStatus } from '../../../providers/network-state/network-state';
// import { NetworkStateProviderMock } from '../../../providers/network-state/__mocks__/network-state.mock';
// import { AppConfigProvider } from '../../../providers/app-config/app-config';
// import { AppConfigProviderMock } from '../../../providers/app-config/__mocks__/app-config.mock';
// import { StoreModel } from '../../../shared/models/store.model';
// import { DateTime } from '../../../shared/helpers/date-time';
// import { PopulateExaminer } from '../journal-data/common/examiner/examiner.actions';
// import journalSlotsDataMock from '../../../modules/journal/__mocks__/journal-slots-data.mock';
// import { journalReducer } from '../../../modules/journal/journal.reducer';
// import { AuthenticationProvider } from '../../../providers/authentication/authentication';
// import { AuthenticationProviderMock } from '../../../providers/authentication/__mocks__/authentication.mock';
// import * as rekeySearchActions from '../../../pages/rekey-search/rekey-search.actions';
// import { TestSlot } from '@dvsa/mes-journal-schema';
// import { NavigationStateProvider } from '../../../providers/navigation-state/navigation-state';
// import { NavigationStateProviderMock } from '../../../providers/navigation-state/__mocks__/navigation-state.mock';
// import { rekeySearchReducer } from '../../../pages/rekey-search/rekey-search.reducer';
// import { SetExaminerBooked } from '../examiner-booked/examiner-booked.actions';
// import { bufferCount } from 'rxjs/operators';
// import { SetExaminerConducted } from '../examiner-conducted/examiner-conducted.actions';
// import { SetExaminerKeyed } from '../examiner-keyed/examiner-keyed.actions';
// import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
// import { PopulateTestCategory } from '../category/category.actions';
// import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
// import { configureTestSuite } from 'ng-bullet';
// import { OtherReasonUpdated, OtherSelected } from '../rekey-reason/rekey-reason.actions';
// import { StartDelegatedTest } from '../delegated-test/delegated-test.actions';
//
// describe('Tests Effects', () => {
//
//   let effects: TestsEffects;
//   let actions$: any;
//   let testPersistenceProviderMock;
//   let store$: Store<StoreModel>;
//   let navigationStateProviderMock: NavigationStateProviderMock;
//   let authenticationProviderMock: AuthenticationProviderMock;
//
//   configureTestSuite(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         StoreModule.forRoot({
//           journal: journalReducer,
//           tests: testsReducer,
//           rekeySearch: rekeySearchReducer,
//         }),
//       ],
//       providers: [
//         TestsEffects,
//         provideMockActions(() => actions$),
//         { provide: AppConfigProvider, useClass: AppConfigProviderMock },
//         { provide: TestPersistenceProvider, useClass: TestPersistenceProviderMock },
//         { provide: TestSubmissionProvider, useClass: TestSubmissionProviderMock },
//         { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
//         { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
//         { provide: NavigationStateProvider, useClass: NavigationStateProviderMock },
//         Store,
//       ],
//     });
//   });
//
//   beforeEach(() => {
//     actions$ = new ReplaySubject(1);
//     effects = TestBed.get(TestsEffects);
//     testPersistenceProviderMock = TestBed.get(TestPersistenceProvider);
//     navigationStateProviderMock = TestBed.get(NavigationStateProvider);
//     authenticationProviderMock = TestBed.get(AuthenticationProvider);
//     store$ = TestBed.get(Store);
//   });
//
//   describe('persistTestsEffect', () => {
//     it('should respond to a PERSIST_TESTS action and delegate to the persistence provider', (done) => {
//       // ARRANGE
//       store$.dispatch(new testsActions.StartTest(12345, TestCategory.B));
//       testPersistenceProviderMock.persistTests.and.returnValue(Promise.resolve());
//       // ACT
//       actions$.next(new testsActions.PersistTests());
//       // ASSERT
//       effects.persistTestsEffect$.subscribe(() => {
//         expect(testPersistenceProviderMock.persistTests).toHaveBeenCalled();
//         done();
//       });
//     });
//   });
//
//   describe('loadPersistedTestsEffect', () => {
//     it('should respond to a LOAD_PERSISTED_TESTS action by loading tests and dispatching a success action', (done) => {
//       // ARRANGE
//       const persistedTests: TestsModel = {
//         ...initialState,
//         currentTest: {
//           ...initialState.currentTest,
//           slotId: '123',
//         },
//       };
//       testPersistenceProviderMock.loadPersistedTests.and.returnValue(Promise.resolve(persistedTests));
//       // ACT
//       actions$.next(new testsActions.LoadPersistedTests());
//       // ASSERT
//       effects.loadPersistedTestsEffect$.subscribe((emission) => {
//         expect(testPersistenceProviderMock.loadPersistedTests).toHaveBeenCalled();
//         expect(emission).toEqual(new testsActions.LoadPersistedTestsSuccess(persistedTests));
//         done();
//       });
//     });
//   });
//
//   describe('startPracticeTestEffect', () => {
//     it('should dispatch the PopulateApplicationReference and PopulateCandidateDetails action', (done) => {
//       // ACT
//       actions$.next(new testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
//       // ASSERT
//       effects.startPracticeTestEffect$.subscribe((result) => {
//         if (result instanceof PopulateApplicationReference)  {
//           expect(result).toEqual(new PopulateApplicationReference(testApplicationMock));
//         }
//         if (result instanceof PopulateCandidateDetails) {
//           expect(result).toEqual(new PopulateCandidateDetails(candidateMock));
//         }
//         done();
//       });
//     });
//   });
//
//   describe('sendCompletedTestsEffect', () => {
//     it('should dispatch use the order of the responses to coordinate subsequent dispatching of actions', (done) => {
//       // ARRANGE
//       // Adds three tests as 'Completed' for the sendCompletedTestsEffect to consume
//       // The http responses are mocked in test-submission.mock.ts
//       const currentTestSlotId = '12345'; // Mocked as a 201 http response
//       const currentTestSlotId1 = '123456'; // Mocked as a 201 http response
//       const currentTestSlotId2 = '1234567'; // Mocked as a 500 http error response
//       store$.dispatch(new testsActions.StartTestReportPracticeTest(testReportPracticeModeSlot.slotDetail.slotId));
//       store$.dispatch(new testStatusActions.SetTestStatusCompleted(testReportPracticeModeSlot.slotDetail.slotId));
//       store$.dispatch(new testsActions.StartTest(Number(currentTestSlotId), TestCategory.B));
//       store$.dispatch(new testStatusActions.SetTestStatusCompleted(currentTestSlotId));
//       store$.dispatch(new testsActions.StartTest(Number(currentTestSlotId1), TestCategory.B));
//       store$.dispatch(new testStatusActions.SetTestStatusCompleted(currentTestSlotId1));
//       store$.dispatch(new testsActions.StartTest(Number(currentTestSlotId2), TestCategory.B));
//       store$.dispatch(new testStatusActions.SetTestStatusCompleted(currentTestSlotId2));
//       // ACT
//       actions$.next(new testsActions.SendCompletedTests());
//       // ASSERT
//       effects.sendCompletedTestsEffect$.subscribe((result) => {
//         if (result instanceof testsActions.SendCompletedTestSuccess) {
//           if (result.completedTestId === currentTestSlotId) {
//             expect(result).toEqual(new testsActions.SendCompletedTestSuccess(currentTestSlotId));
//           }
//           if (result.completedTestId === currentTestSlotId1) {
//             expect(result).toEqual(new testsActions.SendCompletedTestSuccess(currentTestSlotId1));
//           }
//           if (result.completedTestId === currentTestSlotId2) {
//             expect(result).toEqual(new testsActions.SendCompletedTestsFailure());
//           }
//           if (result.completedTestId === testReportPracticeModeSlot.slotDetail.slotId) {
//             fail('Practice test should not be submitted');
//           }
//         }
//         done();
//       });
//     });
//   });
//
//   describe('sendCurrentTestSuccessEffect', () => {
//     it('should dispatch the TestStatusSubmitted action', (done) => {
//       const currentTestSlotId = '12345';
//       store$.dispatch(new testsActions.StartTest(12345, TestCategory.B));
//       // ACT
//       actions$.next(new testsActions.SendCurrentTestSuccess());
//       // ASSERT
//       effects.sendCurrentTestSuccessEffect$.subscribe((result) => {
//         if (result instanceof testStatusActions.SetTestStatusSubmitted)  {
//           expect(result).toEqual(new testStatusActions.SetTestStatusSubmitted(currentTestSlotId));
//         }
//         if (result instanceof testsActions.PersistTests) {
//           expect(result).toEqual(new testsActions.PersistTests());
//         }
//         done();
//       });
//     });
//   });
//
//   describe('startTestEffect', () => {
//     it('should copy the examiner from the journal state into the test state', (done) => {
//       const selectedDate: string = new DateTime().format('YYYY-MM-DD');
//       const examiner = { staffNumber: '123', individualId: 456 };
//       store$.dispatch(new journalActions.SetSelectedDate(selectedDate));
//       store$.dispatch(
//         new journalActions.LoadJournalSuccess(
//           { examiner, slotItemsByDate: journalSlotsDataMock },
//           ConnectionStatus.ONLINE,
//           false,
//           new Date(),
//         ),
//       ); // Load in mock journal state
//       // ACT
//       actions$.next(new testsActions.StartTest(1001, TestCategory.B));
//       // ASSERT
//       effects.startTestEffect$
//       .pipe(
//         bufferCount(10),
//       )
//       .subscribe(([res0, res1, res2, res3, res4, res5, res6, res7, res8, res9]) => {
//         expect(res1).toEqual(new PopulateExaminer(examiner)),
//         expect(res7).toEqual(new SetExaminerBooked(parseInt(examiner.staffNumber, 10))),
//         expect(res8).toEqual(new SetExaminerConducted(parseInt(examiner.staffNumber, 10))),
//         expect(res9).toEqual(new SetExaminerKeyed(parseInt(authenticationProviderMock.getEmployeeId(), 10))),
//         done();
//       });
//     });
//
//     it('should mark the test as a rekey when this is a rekey', (done) => {
//       const selectedDate: string = new DateTime().format('YYYY-MM-DD');
//       const examiner = { staffNumber: '123', individualId: 456 };
//       store$.dispatch(new journalActions.SetSelectedDate(selectedDate));
//       store$.dispatch(
//         new journalActions.LoadJournalSuccess(
//           { examiner, slotItemsByDate: journalSlotsDataMock },
//           ConnectionStatus.ONLINE,
//           false,
//           new Date(),
//         ),
//       ); // Load in mock journal state
//       // ACT
//       actions$.next(new testsActions.StartTest(1001, TestCategory.B, true));
//       // ASSERT
//       effects.startTestEffect$
//       .pipe(
//         bufferCount(13),
//       )
//       .subscribe(([res0, res1, res2, res3, res4, res5, res6, res7, res8, res9, res10, res11, res12]) => {
//         expect(res1).toEqual(new PopulateExaminer(examiner)),
//         expect(res7).toEqual(new SetExaminerBooked(parseInt(examiner.staffNumber, 10))),
//         expect(res8).toEqual(new SetExaminerConducted(parseInt(examiner.staffNumber, 10))),
//         expect(res9).toEqual(new SetExaminerKeyed(parseInt(authenticationProviderMock.getEmployeeId(), 10))),
//         expect(res12).toEqual(new rekeyActions.MarkAsRekey()),
//         done();
//       });
//     });
//
//     it('should get the slot from booked slots when this is a rekey test started from the rekey search', (done) => {
//       spyOn(navigationStateProviderMock, 'isRekeySearch').and.returnValue(true);
//       const testSlot: TestSlot = {
//         slotDetail: {
//           slotId: 4363463,
//         },
//         testCentre: {
//           centreId: 54321,
//           centreName: 'Example Test Centre',
//           costCode: 'EXTC1',
//         },
//         booking: {
//           application: {
//             applicationId: 12345,
//             bookingSequence: 11,
//             checkDigit: 1,
//             testCategory: TestCategory.B,
//           },
//         },
//       };
//       const staffNumber = '654321';
//       store$.dispatch(new rekeySearchActions.SearchBookedTestSuccess(testSlot, staffNumber));
//       // ACT
//       actions$.next(new testsActions.StartTest(1001, testSlot.booking.application.testCategory as TestCategory, true));
//       // ASSERT
//       effects.startTestEffect$
//       .pipe(
//         bufferCount(13),
//       )
//       .subscribe(([res0, res1, res2, res3, res4, res5, res6, res7, res8, res9, res10, res11, res12]) => {
//         expect(res0).toEqual(new PopulateTestCategory(testSlot.booking.application.testCategory as CategoryCode));
//         expect(res1).toEqual(new PopulateExaminer({ staffNumber })),
//         expect(res2).toEqual(new PopulateApplicationReference(testSlot.booking.application)),
//         expect(res3).toEqual(new PopulateCandidateDetails(testSlot.booking.candidate)),
//         expect(res7).toEqual(new SetExaminerBooked(parseInt(staffNumber, 10))),
//         expect(res8).toEqual(new SetExaminerConducted(parseInt(staffNumber, 10))),
//         expect(res9).toEqual(new SetExaminerKeyed(parseInt(authenticationProviderMock.getEmployeeId(), 10))),
//         expect(res12).toEqual(new rekeyActions.MarkAsRekey()),
//         done();
//       });
//     });
//
//     it('should set the rekey reason and reason correctly when it is a delegated examiner test', (done) => {
//       const selectedDate: string = new DateTime().format('YYYY-MM-DD');
//       const examiner = { staffNumber: '123', individualId: 456 };
//       store$.dispatch(new journalActions.SetSelectedDate(selectedDate));
//       store$.dispatch(
//         new journalActions.LoadJournalSuccess(
//           { examiner, slotItemsByDate: journalSlotsDataMock },
//           ConnectionStatus.ONLINE,
//           false,
//           new Date(),
//         ),
//       ); // Load in mock journal state
//       // ACT
//       actions$.next(new testsActions.StartTest(1001, TestCategory.B, false, true));
//       // ASSERT
//       effects.startTestEffect$
//       .pipe(
//         bufferCount(15),
//       )
//       .subscribe(([res0, res1, res2, res3, res4, res5, res6, res7, res8, res9, res10, res11, res12, res13, res14]) => {
//         expect(res12).toEqual(new StartDelegatedTest());
//         expect(res13).toEqual(new OtherSelected(true));
//         expect(res14).toEqual(new OtherReasonUpdated('Delegated Examiner'));
//         done();
//       });
//     });
//   });
//
//   describe('activateTestEffect', () => {
//     it('should call theMarkAsRekey action', (done) => {
//       // ACT
//       actions$.next(new testsActions.ActivateTest(1234, TestCategory.B, true));
//       // ASSERT
//       effects.activateTestEffect$.subscribe((result) => {
//         expect(result instanceof rekeyActions.MarkAsRekey).toBe(true);
//         done();
//       });
//     });
//   });
//
//   describe('sendPartialTest', () => {
//     it('should call the ', (done) => {
//       // Act
//       actions$.next(new testStatusActions.SetTestStatusWriteUp('123'));
//
//       // Assert
//       effects.sendPartialTest$.subscribe((result) => {
//         expect(result instanceof testsActions.SendCompletedTests).toBeTruthy();
//         done();
//       });
//     });
//   });
//
// });

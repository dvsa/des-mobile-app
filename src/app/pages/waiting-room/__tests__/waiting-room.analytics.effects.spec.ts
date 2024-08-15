import { TestBed } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { AnalyticsProvider } from '@providers/analytics/analytics';
import { AnalyticsProviderMock } from '@providers/analytics/__mocks__/analytics.mock';
import { AnalyticRecorded } from '@providers/analytics/analytics.actions';
import { StoreModel } from '@shared/models/store.model';
import * as testsActions from '@store/tests/tests.actions';
import * as fakeJournalActions from '@pages/fake-journal/fake-journal.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import { Application } from '@dvsa/mes-journal-schema';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';
import * as applicationReferenceActions
  from '@store/tests/journal-data/common/application-reference/application-reference.actions';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import {
  VRNModalCancelled,
  VRNModalOpened,
  VRNModalSaved,
} from '@store/tests/candidate-section/candidate-section.actions';
import { Router } from '@angular/router';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import * as waitingRoomActions from '../waiting-room.actions';
import { WaitingRoomAnalyticsEffects } from '../waiting-room.analytics.effects';

describe('WaitingRoomAnalyticsEffects', () => {
  let effects: WaitingRoomAnalyticsEffects;
  let actions$: ReplaySubject<any>;
  let store$: Store<StoreModel>;
  const mockApplication: Application = {
    applicationId: 123456,
    bookingSequence: 78,
    checkDigit: 9,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        WaitingRoomAnalyticsEffects,
        {
          provide: AnalyticsProvider,
          useClass: AnalyticsProviderMock,
        },
        {
          provide: Router,
          useValue: { url: `/${TestFlowPageNames.WAITING_ROOM_PAGE}` },
        },
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        provideMockActions(() => actions$),
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(WaitingRoomAnalyticsEffects);
    store$ = TestBed.inject(Store);
  });

  describe('waitingRoomViewDidEnter', () => {
    it('should call setCurrentPage and addCustomDimension', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      // ACT
      actions$.next(waitingRoomActions.WaitingRoomViewDidEnter());
      // ASSERT
      effects.waitingRoomViewDidEnter$.subscribe((result: ReturnType<typeof AnalyticRecorded>) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        done();
      });
    });
    it('should call setCurrentPage with practice mode prefix and addCustomDimension', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(applicationReferenceActions.PopulateApplicationReference(mockApplication));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      // ACT
      actions$.next(waitingRoomActions.WaitingRoomViewDidEnter());
      // ASSERT
      effects.waitingRoomViewDidEnter$.subscribe((result: ReturnType<typeof AnalyticRecorded>) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        done();
      });
    });

  });

  describe('waitingRoomValidationError', () => {
    it('should call logError', (done) => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      // ACT
      actions$.next(waitingRoomActions.WaitingRoomValidationError('formControl1'));
      // ASSERT
      effects.waitingRoomValidationError$.subscribe((result: ReturnType<typeof AnalyticRecorded>) => {
        expect(result.type)
          .toEqual(AnalyticRecorded.type);
        done();
      });
    });
    it('should call logError, prefixed with practice mode', (done) => {
      // ARRANGE
      store$.dispatch(fakeJournalActions.StartE2EPracticeTest(end2endPracticeSlotId));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      // ACT
      actions$.next(waitingRoomActions.WaitingRoomValidationError('formControl1'));
      // ASSERT
      effects.waitingRoomValidationError$.subscribe((result: ReturnType<typeof AnalyticRecorded>) => {
        expect(result.type)
          .toBe(AnalyticRecorded.type);
        done();
      });
    });

  });

  describe('VrnModalOpened$', () => {
    it('should dispatch action when opening modal', () => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      // ACT
      actions$.next(VRNModalOpened());
      // ASSERT
      effects.vrnModalOpened$.subscribe((result: ReturnType<typeof AnalyticRecorded>) => {
        expect(result.type)
          .toBe(AnalyticRecorded.type);
      });
    });
  });

  describe('VrnModalCancelled$', () => {
    it('should dispatch action when cancel button on modal clicked', () => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      // ACT
      actions$.next(VRNModalCancelled());
      // ASSERT
      effects.vrnModalCancelled$.subscribe((result: ReturnType<typeof AnalyticRecorded>) => {
        expect(result.type)
          .toBe(AnalyticRecorded.type);
      });
    });
  });

  describe('VrnModalSaved$', () => {
    it('should dispatch action when save button on modal clicked', () => {
      // ARRANGE
      store$.dispatch(testsActions.StartTest(123, TestCategory.B));
      store$.dispatch(PopulateCandidateDetails(candidateMock));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
      // ACT
      actions$.next(VRNModalSaved());
      // ASSERT
      effects.vrnModalSaved$.subscribe((result: ReturnType<typeof AnalyticRecorded>) => {
        expect(result.type)
          .toBe(AnalyticRecorded.type);
      });
    });
  });

});

import { HttpErrorResponse, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import { FindUserProviderMock } from '@providers/find-user/__mocks__/find-user.mock';
import { FindUserProvider } from '@providers/find-user/find-user';
import { StoreModel } from '@shared/models/store.model';
import { journalReducer } from '@store/journal/journal.reducer';
import { SetExaminerBooked } from '@store/tests/examiner-booked/examiner-booked.actions';
import { SetExaminerConducted } from '@store/tests/examiner-conducted/examiner-conducted.actions';
import * as testActions from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { ReplaySubject, defer } from 'rxjs';

import { rekeySearchReducer } from '../../rekey-search/rekey-search.reducer';
import * as rekeyReasonActions from '../rekey-reason.actions';
import { RekeyReasonEffects } from '../rekey-reason.effects';

function asyncSuccess(successObject: any) {
  return defer(() => Promise.resolve(successObject));
}

function asyncError(errorObject: any) {
  return defer(() => Promise.reject(errorObject));
}

describe('RekeyReasonEffects', () => {
  let effects: RekeyReasonEffects;
  let actions$: ReplaySubject<any>;
  let findUserProvider: FindUserProvider;
  let store$: Store<StoreModel>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          journal: journalReducer,
          tests: testsReducer,
          rekeySearch: rekeySearchReducer,
        }),
      ],
      providers: [
        RekeyReasonEffects,
        provideMockActions(() => actions$),
        {
          provide: FindUserProvider,
          useClass: FindUserProviderMock,
        },
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(RekeyReasonEffects);
    store$ = TestBed.inject(Store);
    findUserProvider = TestBed.inject(FindUserProvider);
  });

  describe('rekeyReasonValidateTransferEffect', () => {
    describe('not a transfer', () => {
      it('should send the current test and not call the find user provider', (done) => {
        // ARRANGE
        store$.dispatch(testActions.StartTest(12345, TestCategory.B));
        store$.dispatch(SetExaminerBooked(333));
        store$.dispatch(SetExaminerConducted(333));
        spyOn(findUserProvider, 'userExists');
        // ACT
        actions$.next(rekeyReasonActions.ValidateTransferRekey());
        // ASSERT
        effects.rekeyReasonValidateTransferEffect$.subscribe((res) => {
          expect(res).toEqual(testActions.SendCurrentTest());
          expect(findUserProvider.userExists).not.toHaveBeenCalled();
          done();
        });
      });
    });
    describe('transfer', () => {
      it('should send the current test when the staff number is valid', (done) => {
        // ARRANGE
        store$.dispatch(testActions.StartTest(12345, TestCategory.B));
        store$.dispatch(SetExaminerBooked(333));
        store$.dispatch(SetExaminerConducted(789));
        spyOn(findUserProvider, 'userExists').and.returnValue(
          asyncSuccess(
            new HttpResponse({
              status: HttpStatusCode.Ok,
              statusText: 'User found with staff number 789',
            })
          )
        );
        // ACT
        actions$.next(rekeyReasonActions.ValidateTransferRekey());
        // ASSERT
        effects.rekeyReasonValidateTransferEffect$.subscribe((res) => {
          expect(res).toEqual(testActions.SendCurrentTest());
          expect(findUserProvider.userExists).toHaveBeenCalled();
          done();
        });
      });
      it('should return a failure action with a true payload when the staff number is not found', (done) => {
        // ARRANGE
        store$.dispatch(testActions.StartTest(12345, TestCategory.B));
        store$.dispatch(SetExaminerBooked(333));
        store$.dispatch(SetExaminerConducted(57463524));
        spyOn(findUserProvider, 'userExists').and.returnValue(
          asyncSuccess(
            new HttpResponse({
              status: HttpStatusCode.NoContent,
              statusText: null,
            })
          )
        );
        // ACT
        actions$.next(rekeyReasonActions.ValidateTransferRekey());
        // ASSERT
        effects.rekeyReasonValidateTransferEffect$.subscribe((res) => {
          expect(res).toEqual(rekeyReasonActions.ValidateTransferRekeyFailed(true));
          expect(findUserProvider.userExists).toHaveBeenCalled();
          done();
        });
      });
      it('should return a failure action with a false payload when the find user provider errors', (done) => {
        // ARRANGE
        spyOn(findUserProvider, 'userExists').and.returnValue(
          asyncError(
            new HttpErrorResponse({
              error: 'Error message',
              status: HttpStatusCode.Unauthorized,
              statusText: 'OK',
            })
          )
        );
        store$.dispatch(testActions.StartTest(12345, TestCategory.B));
        store$.dispatch(SetExaminerBooked(333));
        store$.dispatch(SetExaminerConducted(789));
        // ACT
        actions$.next(rekeyReasonActions.ValidateTransferRekey());
        // ASSERT
        effects.rekeyReasonValidateTransferEffect$.subscribe((res) => {
          expect(res).toEqual(rekeyReasonActions.ValidateTransferRekeyFailed(true));
          expect(findUserProvider.userExists).toHaveBeenCalled();
          done();
        });
      });
    });
  });
});

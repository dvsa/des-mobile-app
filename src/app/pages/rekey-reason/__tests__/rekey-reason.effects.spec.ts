import { ReplaySubject, defer } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { configureTestSuite } from 'ng-bullet';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { FindUserProvider } from '@providers/find-user/find-user';
import { FindUserProviderMock } from '@providers/find-user/__mocks__/find-user.mock';
import * as testActions from '@store/tests/tests.actions';
import { journalReducer } from '@store/journal/journal.reducer';
import { testsReducer } from '@store/tests/tests.reducer';
import { SetExaminerBooked } from '@store/tests/examiner-booked/examiner-booked.actions';
import { SetExaminerConducted } from '@store/tests/examiner-conducted/examiner-conducted.actions';

import { rekeySearchReducer } from '../../rekey-search/rekey-search.reducer';
import { RekeyReasonEffects } from '../rekey-reason.effects';
import * as rekeyReasonActions from '../rekey-reason.actions';

function asyncSuccess(successObject: any) {
  return defer(() => Promise.resolve(successObject));
}

function asyncError(errorObject: any) {
  return defer(() => Promise.reject(errorObject));
}

describe('RekeyReasonEffects', () => {
  let effects: RekeyReasonEffects;
  let actions$: any;
  let findUserProvider: FindUserProvider;
  let store$: Store<StoreModel>;

  configureTestSuite(() => {
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
        { provide: FindUserProvider, useClass: FindUserProviderMock },
        Store,
      ],
    });
  });

  beforeEach(() => {
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
        spyOn(findUserProvider, 'userExists').and.returnValue(asyncSuccess(new HttpResponse({
          status: 200,
          statusText: 'OK',
        })));
        // ACT
        actions$.next(rekeyReasonActions.ValidateTransferRekey());
        // ASSERT
        effects.rekeyReasonValidateTransferEffect$.subscribe((res) => {
          expect(res).toEqual(testActions.SendCurrentTest());
          expect(findUserProvider.userExists).toHaveBeenCalled();
          done();
        });
      });
      it('should return a failure action with a true payload when the staff number is not valid', (done) => {
        // ARRANGE
        store$.dispatch(testActions.StartTest(12345, TestCategory.B));
        store$.dispatch(SetExaminerBooked(333));
        store$.dispatch(SetExaminerConducted(57463524));
        spyOn(findUserProvider, 'userExists').and.returnValue(asyncError(new HttpErrorResponse({
          error: 'Error message',
          status: 404,
          statusText: 'Not Found',
        })));
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
        spyOn(findUserProvider, 'userExists').and.returnValue(asyncError(new HttpErrorResponse({
          error: 'Error message',
          status: 401,
          statusText: 'OK',
        })));
        store$.dispatch(testActions.StartTest(12345, TestCategory.B));
        store$.dispatch(SetExaminerBooked(333));
        store$.dispatch(SetExaminerConducted(789));
        // ACT
        actions$.next(rekeyReasonActions.ValidateTransferRekey());
        // ASSERT
        effects.rekeyReasonValidateTransferEffect$.subscribe((res) => {
          expect(res).toEqual(rekeyReasonActions.ValidateTransferRekeyFailed(false));
          expect(findUserProvider.userExists).toHaveBeenCalled();
          done();
        });
      });
    });
  });

});

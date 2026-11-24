import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import * as testStatusActions from '@store/tests/test-status/test-status.actions';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import * as testsActions from '@store/tests/tests.actions';
import { ReplaySubject } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import * as communicationActions from '../communication.actions';
import { CommunicationEffects } from '../communication.effects';

describe('CommunicationEffects', () => {
  let effects: CommunicationEffects;
  let actions$: ReplaySubject<Action>;
  let status: TestStatus;
  const currentSlotId = '1234';

  beforeEach(() => {
    status = TestStatus.Started;
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: () => ({
            currentTest: {
              slotId: currentSlotId,
            },
            testStatus: { [currentSlotId]: status },
            startedTests: {},
          }),
        }),
      ],
      providers: [CommunicationEffects, provideMockActions(() => actions$), Store],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(CommunicationEffects);
  });

  describe('submitCommunicationInfoEffect', () => {
    it.each([TestStatus.Started, TestStatus.Decided, TestStatus.WriteUp])(
      'should persist without changing an existing %s status',
      (existingStatus) => {
        status = existingStatus;
        TestBed.inject(Store).dispatch({ type: '[Test] Refresh status' });
        const results: Action[] = [];
        const subscription = effects.communicationSubmitInfoEffect$.subscribe((result) => results.push(result));

        actions$.next(communicationActions.CommunicationSubmitInfo());

        expect(results).toEqual([testsActions.PersistTests()]);
        subscription.unsubscribe();
      }
    );

    it('should start and persist a previously booked test', () => {
      status = TestStatus.Booked;
      TestBed.inject(Store).dispatch({ type: '[Test] Refresh status' });
      const results: Action[] = [];
      const subscription = effects.communicationSubmitInfoEffect$.subscribe((result) => results.push(result));

      actions$.next(communicationActions.CommunicationSubmitInfo());

      expect(results).toEqual([testStatusActions.SetTestStatusStarted(currentSlotId), testsActions.PersistTests()]);
      subscription.unsubscribe();
    });
  });
});

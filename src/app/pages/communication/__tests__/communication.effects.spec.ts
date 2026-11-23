import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import * as testsActions from '@store/tests/tests.actions';
import { ReplaySubject } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import * as communicationActions from '../communication.actions';
import { CommunicationEffects } from '../communication.effects';

describe('CommunicationEffects', () => {
  let effects: CommunicationEffects;
  let actions$: ReplaySubject<Action>;
  const currentSlotId = '1234';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: () => ({
            currentTest: {
              slotId: currentSlotId,
            },
            testStatus: {},
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
    it('should return PERSIST_TESTS action', () => {
      actions$.next(communicationActions.CommunicationSubmitInfo());
      effects.communicationSubmitInfoEffect$.subscribe((result) => {
        if (result.type === testsActions.PersistTests.type) {
          expect(result.type).toEqual(testsActions.PersistTests().type);
        }
      });
    });
  });
});

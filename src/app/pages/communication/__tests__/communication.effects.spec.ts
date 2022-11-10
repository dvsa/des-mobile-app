import { TestBed, waitForAsync } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { StoreModule, Store } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import * as testStatusActions from '@store/tests/test-status/test-status.actions';
import * as testsActions from '@store/tests/tests.actions';
import * as communicationActions from '../communication.actions';
import { CommunicationEffects } from '../communication.effects';

describe('CommunicationEffects', () => {
  let effects: CommunicationEffects;
  let actions$: ReplaySubject<any>;
  const currentSlotId = '1234';

  beforeEach(waitForAsync(() => {
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
      providers: [
        CommunicationEffects,
        provideMockActions(() => actions$),
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(CommunicationEffects);
  }));

  describe('submitCommunicationInfoEffect', () => {
    it('should return SET_STATUS_DECIDED & PERSIST_TESTS actions', (done) => {
      actions$.next(communicationActions.CommunicationSubmitInfo());
      effects.communicationSubmitInfoEffect$.subscribe((result) => {
        if (result.type === testStatusActions.SetTestStatusStarted.type) {
          expect(result.type).toEqual(testStatusActions.SetTestStatusStarted(currentSlotId).type);
        }
        if (result.type === testsActions.PersistTests.type) {
          expect(result.type).toEqual(testsActions.PersistTests().type);
        }
        done();
      });
    });
  });

});

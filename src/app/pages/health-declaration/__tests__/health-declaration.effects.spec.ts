import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store, StoreModule } from '@ngrx/store';
import * as testsActions from '@store/tests/tests.actions';
import { ReplaySubject } from 'rxjs';
import * as healthDeclarationActions from '../health-declaration.actions';
import { HealthDeclarationEffects } from '../health-declaration.effects';

describe('HealthDeclarationEffects', () => {
  let effects: HealthDeclarationEffects;
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
      providers: [HealthDeclarationEffects, provideMockActions(() => actions$), Store],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(HealthDeclarationEffects);
  }));

  describe('endHealthDeclarationEffect', () => {
    it('should return SET_TEST_STATUS_WRITE_UP & PERSIST_TESTS actions', (done) => {
      actions$.next(healthDeclarationActions.ContinueFromDeclaration());

      effects.endHealthDeclarationEffect$.subscribe((result) => {
        if (result.type === testsActions.PersistTests.type) {
          expect(result).toEqual(testsActions.PersistTests());
          done();
        }
      });
    });
  });
});

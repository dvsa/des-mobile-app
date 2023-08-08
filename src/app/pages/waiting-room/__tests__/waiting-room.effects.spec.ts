import { TestBed, waitForAsync } from '@angular/core/testing';
import { ReplaySubject } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { WaitingRoomEffects } from '@pages/waiting-room/waiting-room.effects';
import {
  CandidateChoseToProceedWithTestInWelsh,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import { ConductedLanguage } from '@dvsa/mes-test-schema/categories/common';
import { TranslateService } from '@ngx-translate/core';
import { translateServiceMock } from '@shared/helpers/__mocks__/translate.mock';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';

describe('WaitingRoomEffects', () => {
  let effects: WaitingRoomEffects;
  let actions$: ReplaySubject<any>;
  const currentSlotId = '1234';
  let translate: TranslateService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: () => ({
            currentTest: {
              slotId: currentSlotId,
            },
          }),
        }),
      ],
      providers: [
        WaitingRoomEffects,
        {
          provide: TranslateService,
          useValue: translateServiceMock,
        },
        provideMockActions(() => actions$),
        Store,
      ],
    });

    actions$ = new ReplaySubject(1);
    effects = TestBed.inject(WaitingRoomEffects);
    translate = TestBed.inject(TranslateService);
    spyOn(translate, 'use');
  }));

  describe('proceedWithTestInLanguage$', () => {
    it('should call through to the translate service', (done) => {
      actions$.next(CandidateChoseToProceedWithTestInWelsh(Language.CYMRAEG as ConductedLanguage));

      effects.proceedWithTestInLanguage$.subscribe(() => {
        expect(translate.use)
          .toHaveBeenCalledWith('cy');
        done();
      });
    });
  });

});

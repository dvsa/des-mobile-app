import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import {
  CandidateChoseToProceedWithTestInEnglish,
  CandidateChoseToProceedWithTestInWelsh,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import { TranslateService } from '@ngx-translate/core';
import { configureI18N } from '@shared/helpers/translation.helpers';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';

@Injectable()
export class WaitingRoomEffects {
  private actions$ = inject(Actions);
  private translate = inject(TranslateService);

  proceedWithTestInLanguage$ = createEffect(() => this.actions$.pipe(
    ofType(
      CandidateChoseToProceedWithTestInWelsh,
      CandidateChoseToProceedWithTestInEnglish,
    ),
    map(({ conductedLanguage }) => configureI18N(conductedLanguage as Language, this.translate)),
  ), { dispatch: false });
}

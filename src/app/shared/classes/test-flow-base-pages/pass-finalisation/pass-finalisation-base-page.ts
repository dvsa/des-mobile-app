import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { StoreModel } from '@shared/models/store.model';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { getTests } from '@store/tests/tests.reducer';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';

import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';

export interface CommonPassFinalisationPageState {
  candidateName$: Observable<string>;
}

export abstract class PassFinalisationPageComponent extends PracticeableBasePageComponent {

  commonPageState: CommonPassFinalisationPageState;

  protected constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
  ) {
    super(platform, authenticationProvider, router, store$);
  }

  onInitialisation(): void {
    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.commonPageState = {
      candidateName$: currentTest$.pipe(
        select(getJournalData),
        select(getCandidate),
        select(getCandidateName),
      ),
    };
  }

}

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { StoreModel } from '@shared/models/store.model';
import { JournalDataUnion } from '@shared/unions/journal-union';
import { getUntitledCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { getTests } from '@store/tests/tests.reducer';
import { PersistTests } from '@store/tests/tests.actions';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { AuthenticationProvider } from '@providers/authentication/authentication';

import { BasePageComponent } from '../../base-page';

export interface CommonWaitingRoomToCarPageState {
  candidateName$: Observable<string>;
}

export abstract class WaitingRoomToCarBasePageComponent extends BasePageComponent {

  commonPageState: CommonWaitingRoomToCarPageState;
  subscription: Subscription;
  merged$: Observable<boolean | string | JournalDataUnion>;

  protected constructor(
    protected store$: Store<StoreModel>,
    protected platform: Platform,
    protected authenticationProvider: AuthenticationProvider,
    protected router: Router,
  ) {
    super(platform, authenticationProvider, router);
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
        select(getUntitledCandidateName),
      ),
    };
  }

  ionViewDidEnter(): void {
    // @TODO: Enable when WRTC actions have been created;
    // this.store$.dispatch(WaitingRoomToCarViewDidEnter());
  }

  ionViewWillLeave(): void {
    this.store$.dispatch(PersistTests());
  }

}

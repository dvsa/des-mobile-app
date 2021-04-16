import { select, Store } from '@ngrx/store';
import { Injectable, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import { getCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';

import { BasePageComponent } from '../../base-page';

export interface CommonCommunicationPageState {
  candidateName$: Observable<string>;
}

@Injectable()
export abstract class CommunicationBasePageComponent extends BasePageComponent implements OnInit {

  commonPageState: CommonCommunicationPageState;
  subscription: Subscription;
  merged$: Observable<string | boolean>;

  protected constructor(
    protected store$: Store<StoreModel>,
    protected platform: Platform,
    protected authenticationProvider: AuthenticationProvider,
    protected router: Router,
  ) {
    super(platform, authenticationProvider, router);
  }

  ngOnInit(): void {
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

  ionViewWillEnter(): boolean {
    if (this.subscription.closed && this.merged$) {
      this.subscription = this.merged$.subscribe();
    }
    return true;
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}

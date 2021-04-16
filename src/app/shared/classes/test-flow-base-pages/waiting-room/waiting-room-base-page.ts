import { select, Store } from '@ngrx/store';
import { Injectable, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { StoreModel } from '@shared/models/store.model';
import { JournalDataUnion } from '@shared/unions/journal-union';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getPreTestDeclarations } from '@store/tests/pre-test-declarations/pre-test-declarations.reducer';
import { getInsuranceDeclarationStatus } from '@store/tests/pre-test-declarations/pre-test-declarations.selector';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { BasePageComponent } from '../../base-page';

export interface CommonWaitingRoomPageState {
  insuranceDeclarationAccepted$: Observable<boolean>;
}

@Injectable()
export abstract class WaitingRoomBasePageComponent extends BasePageComponent implements OnInit {

  commonPageState: CommonWaitingRoomPageState;
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

  ngOnInit(): void {
    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.commonPageState = {
      insuranceDeclarationAccepted$: currentTest$.pipe(
        select(getPreTestDeclarations),
        select(getInsuranceDeclarationStatus),
      ),
    };
  }

  ionViewWillEnter(): boolean {
    if (this.merged$) {
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

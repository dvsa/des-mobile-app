import { Component, Injector, OnInit } from '@angular/core';
import { KeepAwake as Insomnia } from '@capacitor-community/keep-awake';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ViewDidEnter } from '@ionic/angular';
import { DASHBOARD_PAGE, DELEGATED_REKEY_SEARCH_PAGE } from '@pages/page-names.constants';
import { BasePageComponent } from '@shared/classes/base-page';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { SendCurrentTest } from '@store/tests/tests.actions';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTestStatus } from '@store/tests/tests.selector';
import { getDelegatedRekeySearchState } from '../delegated-rekey-search/delegated-rekey-search.reducer';
import { getIsLoading } from '../delegated-rekey-search/delegated-rekey-search.selector';

interface DelegatedRekeyUploadOutcomePageState {
  testStatus$: Observable<TestStatus>;
  isUploading$: Observable<boolean>;
}

@Component({
  selector: 'page-delegated-rekey-upload-outcome',
  templateUrl: 'delegated-rekey-upload-outcome.html',
  styleUrls: ['delegated-rekey-upload-outcome.scss'],
})
export class DelegatedRekeyUploadOutcomePage extends BasePageComponent implements OnInit, ViewDidEnter {
  pageState: DelegatedRekeyUploadOutcomePageState;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.pageState = {
      testStatus$: this.store$.pipe(select(getTests), map(getCurrentTestStatus)),
      isUploading$: this.store$.pipe(select(getDelegatedRekeySearchState), map(getIsLoading)),
    };
  }

  async ionViewDidEnter(): Promise<void> {
    if (super.isIos()) {
      await ScreenOrientation.unlock();
      await Insomnia.allowSleep();
      await this.deviceProvider.disableSingleAppMode();
    }
  }

  retryUpload(): void {
    this.store$.dispatch(SendCurrentTest());
  }

  isStatusSubmitted(status: TestStatus): boolean {
    return status === TestStatus.Submitted;
  }

  async goToDashboard(): Promise<void> {
    await this.router.navigate([DASHBOARD_PAGE], { replaceUrl: true });
  }

  async goToDelegatedSearch(): Promise<void> {
    await this.router.navigate([DELEGATED_REKEY_SEARCH_PAGE]);
  }
}

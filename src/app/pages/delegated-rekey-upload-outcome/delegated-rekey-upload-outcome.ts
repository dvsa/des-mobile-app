import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DeviceProvider } from '@providers/device/device';
import { BasePageComponent } from '@shared/classes/base-page';
import { StoreModel } from '@shared/models/store.model';
import { SendCurrentTest } from '@store/tests/tests.actions';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTestStatus } from '@store/tests/tests.selector';
import { DASHBOARD_PAGE, DELEGATED_REKEY_SEARCH_PAGE } from '@pages/page-names.constants';
import { getIsLoading } from '../delegated-rekey-search/delegated-rekey-search.selector';
import { getDelegatedRekeySearchState } from '../delegated-rekey-search/delegated-rekey-search.reducer';

interface DelegatedRekeyUploadOutcomePageState {
  testStatus$: Observable<TestStatus>
  isUploading$: Observable<boolean>,
}

@Component({
  selector: 'page-delegated-rekey-upload-outcome',
  templateUrl: 'delegated-rekey-upload-outcome.html',
  styleUrls: ['delegated-rekey-upload-outcome.scss'],
})
export class DelegatedRekeyUploadOutcomePage extends BasePageComponent {

  pageState: DelegatedRekeyUploadOutcomePageState;

  constructor(
    private store$: Store<StoreModel>,
    private deviceProvider: DeviceProvider,
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public insomnia: Insomnia,
    protected router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.pageState = {
      testStatus$: this.store$.pipe(
        select(getTests),
        map(getCurrentTestStatus),
      ),
      isUploading$: this.store$.pipe(
        select(getDelegatedRekeySearchState),
        map(getIsLoading),
      ),
    };
  }

  async ionViewDidEnter(): Promise<void> {
    if (super.isIos()) {
      await ScreenOrientation.unlock();
      await this.insomnia.allowSleepAgain();
      await this.deviceProvider.disableSingleAppMode();
    }
  }

  retryUpload(): void {
    this.store$.dispatch(SendCurrentTest());
  }

  isStatusSubmitted(status): boolean {
    return status === TestStatus.Submitted;
  }

  async goToDashboard(): Promise<void> {
    await this.router.navigate([DASHBOARD_PAGE], { replaceUrl: true });
  }

  async goToDelegatedSearch(): Promise<void> {
    await this.router.navigate([DELEGATED_REKEY_SEARCH_PAGE]);
  }

}

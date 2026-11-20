import { Component, Injector, computed } from '@angular/core';
import { KeepAwake as Insomnia } from '@capacitor-community/keep-awake';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonRow,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  ViewDidEnter,
} from '@ionic/angular';
import { DASHBOARD_PAGE, DELEGATED_REKEY_SEARCH_PAGE } from '@pages/page-names.constants';
import { BasePageComponent } from '@shared/classes/base-page';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { SendCurrentTest } from '@store/tests/tests.actions';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTestStatus } from '@store/tests/tests.selector';
import { getDelegatedRekeySearchState } from '../delegated-rekey-search/delegated-rekey-search.reducer';
import { getIsLoading } from '../delegated-rekey-search/delegated-rekey-search.selector';

@Component({
  selector: 'page-delegated-rekey-upload-outcome',
  templateUrl: 'delegated-rekey-upload-outcome.html',
  styleUrls: ['delegated-rekey-upload-outcome.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
    IonIcon,
    IonText,
    IonButton,
    IonFooter,
  ],
})
export class DelegatedRekeyUploadOutcomePage extends BasePageComponent implements ViewDidEnter {
  private readonly tests = this.store$.selectSignal(getTests);
  private readonly searchState = this.store$.selectSignal(getDelegatedRekeySearchState);
  readonly testStatus = computed(() => getCurrentTestStatus(this.tests()));
  readonly isUploading = computed(() => getIsLoading(this.searchState()));

  constructor(public injector: Injector) {
    super();
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

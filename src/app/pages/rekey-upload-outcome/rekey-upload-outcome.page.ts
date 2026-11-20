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
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { JOURNAL_PAGE, REKEY_SEARCH_PAGE } from '@pages/page-names.constants';
import { getRekeyReasonState } from '@pages/rekey-reason/rekey-reason.reducer';
import { selectIsCurrentTestFromRekeySearch } from '@pages/rekey-search/rekey-search.selector';
import { RekeyUploadOutcomeViewDidEnter } from '@pages/rekey-upload-outcome/rekey-upload-outcome.actions';
import { BasePageComponent } from '@shared/classes/base-page';
import { getUploadStatus } from '@store/tests/rekey-reason/rekey-reason.selector';
import { EndRekey } from '@store/tests/rekey/rekey.actions';

@Component({
  selector: '.rekey-upload-outcome-page',
  templateUrl: './rekey-upload-outcome.page.html',
  styleUrls: ['./rekey-upload-outcome.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonText,
    IonFooter,
    IonButton,
  ],
})
export class RekeyUploadOutcomePage extends BasePageComponent {
  private readonly rekeyReasonState = this.store$.selectSignal(getRekeyReasonState);
  readonly duplicateUpload = computed(() => getUploadStatus(this.rekeyReasonState()).isDuplicate);
  fromRekeySearch = this.store$.selectSignal(selectIsCurrentTestFromRekeySearch);

  constructor(public injector: Injector) {
    super();
  }

  async ionViewDidEnter(): Promise<void> {
    if (super.isIos()) {
      await ScreenOrientation.unlock();
      await Insomnia.allowSleep();
      await this.deviceProvider.disableSingleAppMode();
    }

    this.store$.dispatch(RekeyUploadOutcomeViewDidEnter());
  }

  goToJournal = async (): Promise<void> => {
    if (this.fromRekeySearch()) {
      await this.router.navigate([REKEY_SEARCH_PAGE]);
    } else {
      await this.router.navigate([JOURNAL_PAGE]);
    }
    this.store$.dispatch(EndRekey());
  };
}

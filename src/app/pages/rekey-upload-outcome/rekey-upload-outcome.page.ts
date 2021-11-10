import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { getRekeyReasonState } from '@pages/rekey-reason/rekey-reason.reducer';
import { getUploadStatus } from '@store/tests/rekey-reason/rekey-reason.selector';
import { StoreModel } from '@shared/models/store.model';
import { DeviceProvider } from '@providers/device/device';
import { EndRekey } from '@store/tests/rekey/rekey.actions';
import { BasePageComponent } from '@shared/classes/base-page';
import { RekeyUploadOutcomeViewDidEnter } from '@pages/rekey-upload-outcome/rekey-upload-outcome.actions';

interface RekeyUploadOutcomePageState {
  duplicateUpload$: Observable<boolean>;
}

@Component({
  selector: '.rekey-upload-outcome-page',
  templateUrl: './rekey-upload-outcome.page.html',
  styleUrls: ['./rekey-upload-outcome.page.scss'],
})
export class RekeyUploadOutcomePage extends BasePageComponent implements OnInit {

  pageState: RekeyUploadOutcomePageState;

  constructor(
    private store$: Store<StoreModel>,
    private deviceProvider: DeviceProvider,
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public screenOrientation: ScreenOrientation,
    public insomnia: Insomnia,
    protected router: Router,
  ) {
    super(platform, authenticationProvider, router);
  }

  ngOnInit(): void {
    this.pageState = {
      duplicateUpload$: this.store$.pipe(
        select(getRekeyReasonState),
        select(getUploadStatus),
        map((uploadStatus) => uploadStatus.isDuplicate),
      ),
    };
  }

  ionViewDidEnter(): void {
    if (super.isIos()) {
      this.screenOrientation.unlock();
      this.insomnia.allowSleepAgain();
      this.deviceProvider.disableSingleAppMode();
    }

    this.store$.dispatch(RekeyUploadOutcomeViewDidEnter());
  }

  goToJournal() {
    // const rekeySearchPage = this.navController.getViews().find((view) => view.id === REKEY_SEARCH_PAGE);
    // const journalPage = this.navController.getViews().find((view) => view.id === JOURNAL_PAGE);
    // if (rekeySearchPage) {
    //   this.navController.popTo(rekeySearchPage);
    // } else {
    //   this.navController.popTo(journalPage);
    // }
    this.store$.dispatch(EndRekey());
  }
}

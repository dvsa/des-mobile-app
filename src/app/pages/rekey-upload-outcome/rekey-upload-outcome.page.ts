import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { merge, Observable, Subscription } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { isEmpty } from 'lodash';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { getRekeyReasonState } from '@pages/rekey-reason/rekey-reason.reducer';
import { getUploadStatus } from '@store/tests/rekey-reason/rekey-reason.selector';
import { StoreModel } from '@shared/models/store.model';
import { DeviceProvider } from '@providers/device/device';
import { EndRekey } from '@store/tests/rekey/rekey.actions';
import { BasePageComponent } from '@shared/classes/base-page';
import { RekeyUploadOutcomeViewDidEnter } from '@pages/rekey-upload-outcome/rekey-upload-outcome.actions';
import { getRekeySearchState } from '@pages/rekey-search/rekey-search.reducer';
import { getBookedTestSlot } from '@pages/rekey-search/rekey-search.selector';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import {
  getApplicationReference,
} from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import {
  getApplicationNumber,
} from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { getTests } from '@store/tests/tests.reducer';
import { JOURNAL_PAGE, REKEY_SEARCH_PAGE } from '@pages/page-names.constants';

interface RekeyUploadOutcomePageState {
  duplicateUpload$: Observable<boolean>;
  fromRekeySearch$: Observable<boolean>;
}

@Component({
  selector: '.rekey-upload-outcome-page',
  templateUrl: './rekey-upload-outcome.page.html',
  styleUrls: ['./rekey-upload-outcome.page.scss'],
})
export class RekeyUploadOutcomePage extends BasePageComponent implements OnInit {

  pageState: RekeyUploadOutcomePageState;
  merged$: Observable<boolean>;
  fromRekeySearch: boolean;
  subscription: Subscription = Subscription.EMPTY;

  constructor(
    private store$: Store<StoreModel>,
    private deviceProvider: DeviceProvider,
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public insomnia: Insomnia,
    protected router: Router,
  ) {
    super(platform, authenticationProvider, router);
  }

  ngOnInit(): void {
    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.pageState = {
      duplicateUpload$: this.store$.pipe(
        select(getRekeyReasonState),
        select(getUploadStatus),
        map((uploadStatus) => uploadStatus.isDuplicate),
      ),
      fromRekeySearch$: this.store$.pipe(
        select(getRekeySearchState),
        map(getBookedTestSlot),
        withLatestFrom(currentTest$.pipe(
          select(getJournalData),
          select(getApplicationReference),
          select(getApplicationNumber),
        )),
        map(([testSlot, appRef]: [TestSlot, string]) => {
          if (isEmpty(testSlot)) {
            return false;
          }
          return formatApplicationReference(testSlot?.booking?.application) === appRef;
        }),
      ),
    };

    const { fromRekeySearch$ } = this.pageState;

    this.merged$ = merge(
      fromRekeySearch$.pipe(map((val) => this.fromRekeySearch = val)),
    );
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

  async ionViewDidEnter(): Promise<void> {
    if (super.isIos()) {
      await ScreenOrientation.unlock();
      await this.insomnia.allowSleepAgain();
      await this.deviceProvider.disableSingleAppMode();
    }

    this.store$.dispatch(RekeyUploadOutcomeViewDidEnter());
  }

  goToJournal = async (): Promise<void> => {
    if (this.fromRekeySearch) {
      await this.router.navigate([REKEY_SEARCH_PAGE]);
    } else {
      await this.router.navigate([JOURNAL_PAGE]);
    }
    this.store$.dispatch(EndRekey());
  };
}

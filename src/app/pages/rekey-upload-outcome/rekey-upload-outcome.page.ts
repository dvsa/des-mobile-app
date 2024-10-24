import { Component, Injector, OnInit } from '@angular/core';
import { KeepAwake as Insomnia } from '@capacitor-community/keep-awake';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { select } from '@ngrx/store';
import { isEmpty } from 'lodash-es';
import { Observable, Subscription, merge } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { JOURNAL_PAGE, REKEY_SEARCH_PAGE } from '@pages/page-names.constants';
import { getRekeyReasonState } from '@pages/rekey-reason/rekey-reason.reducer';
import { getRekeySearchState } from '@pages/rekey-search/rekey-search.reducer';
import { getBookedTestSlot } from '@pages/rekey-search/rekey-search.selector';
import { RekeyUploadOutcomeViewDidEnter } from '@pages/rekey-upload-outcome/rekey-upload-outcome.actions';
import { BasePageComponent } from '@shared/classes/base-page';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { getApplicationReference } from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import { getApplicationNumber } from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import { getUploadStatus } from '@store/tests/rekey-reason/rekey-reason.selector';
import { EndRekey } from '@store/tests/rekey/rekey.actions';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';

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

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    const currentTest$ = this.store$.pipe(select(getTests), select(getCurrentTest));

    this.pageState = {
      duplicateUpload$: this.store$.pipe(
        select(getRekeyReasonState),
        select(getUploadStatus),
        map((uploadStatus) => uploadStatus.isDuplicate)
      ),
      fromRekeySearch$: this.store$.pipe(
        select(getRekeySearchState),
        map(getBookedTestSlot),
        withLatestFrom(
          currentTest$.pipe(select(getJournalData), select(getApplicationReference), select(getApplicationNumber))
        ),
        map(([testSlot, appRef]: [TestSlot, string]) => {
          if (isEmpty(testSlot)) {
            return false;
          }
          return formatApplicationReference(testSlot?.booking?.application) === appRef;
        })
      ),
    };

    const { fromRekeySearch$ } = this.pageState;

    this.merged$ = merge(fromRekeySearch$.pipe(map((val) => (this.fromRekeySearch = val))));
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
      await Insomnia.allowSleep();
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

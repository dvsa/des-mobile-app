import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable, merge, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData } from '@store/tests/tests.selector';
import { getCommunicationPreference } from '@store/tests/communication-preferences/communication-preferences.reducer';
import { getConductedLanguage } from '@store/tests/communication-preferences/communication-preferences.selector';
import { isWelshTest } from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.selector';
import {
  getTestSlotAttributes,
} from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.reducer';
import { JournalDataUnion } from '@shared/unions/journal-union';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { configureI18N } from '@shared/helpers/translation.helpers';

interface WaitingRoomPageState {
  welshTest$: Observable<boolean>;
  conductedLanguage$: Observable<string>;
}

@Component({
  selector: 'app-waiting-room-cat-b',
  templateUrl: './waiting-room.cat-b.page.html',
  styleUrls: ['./waiting-room.cat-b.page.scss'],
})
export class WaitingRoomCatBPage implements OnInit {

  pageState: WaitingRoomPageState;
  subscription: Subscription;
  merged$: Observable<boolean | string | JournalDataUnion>;

  constructor(
    private navController: NavController,
    public routeByCat: RouteByCategoryProvider,
    private translate: TranslateService,
    private store$: Store<StoreModel>,
  ) {
  }

  ngOnInit(): void {
    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.pageState = {
      welshTest$: currentTest$.pipe(
        select(getJournalData),
        select(getTestSlotAttributes),
        select(isWelshTest),
      ),
      conductedLanguage$: currentTest$.pipe(
        select(getCommunicationPreference),
        select(getConductedLanguage),
      ),
    };

    const { welshTest$, conductedLanguage$ } = this.pageState;
    this.merged$ = merge(
      welshTest$,
      conductedLanguage$.pipe(
        tap((value: string) => configureI18N(value as Language, this.translate)),
      ),
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

  navigateBack(): void {
    this.navController.back();
  }

  async navigateForward(): Promise<void> {
    await this.routeByCat.navigateToPage(TestFlowPageNames.COMMUNICATION_PAGE);
  }
}

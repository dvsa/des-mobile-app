import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { CAT_B, JOURNAL_PAGE } from '@pages/page-names.constants';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { Observable } from 'rxjs';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getRekeyIndicator } from '@store/tests/rekey/rekey.reducer';
import { isRekey } from '@store/tests/rekey/rekey.selector';

interface BackToOfficePageState {
  isRekey$: Observable<boolean>;
}

@Component({
  selector: 'app-back-to-office',
  templateUrl: './back-to-office.page.html',
  styleUrls: ['./back-to-office.page.scss'],
})
export class BackToOfficePage extends PracticeableBasePageComponent implements OnInit {
  pageState: BackToOfficePageState;
  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    public navController: NavController,
    public routeByCat: RouteByCategoryProvider,
  ) {
    super(platform, authenticationProvider, router, store$);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.pageState = {
      isRekey$: this.store$.pipe(
        select(getTests),
        select(getCurrentTest),
        select(getRekeyIndicator),
        select(isRekey),
      ),
    };
  }

  async navigateOffice(): Promise<void> {
    await this.router.navigate([CAT_B.OFFICE_PAGE]);
  }
  async navigateJournal(): Promise<void> {
    await this.router.navigate([JOURNAL_PAGE]);
  }
}

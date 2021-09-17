import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { StoreModel } from '@shared/models/store.model';
import { getCurrentTest, getActivityCode } from '@store/tests/tests.selector';
import { getTests } from '@store/tests/tests.reducer';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { ActivityCodeModel } from '@shared/constants/activity-code/activity-code.constants';

import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { CompleteTest, SavingWriteUpForLater } from '@pages/office/office.actions';
import { JOURNAL_PAGE } from '@pages/page-names.constants';
import { PersistTests } from '@store/tests/tests.actions';

export interface CommonOfficePageState {
  activityCode$: Observable<ActivityCodeModel>;
}

export abstract class OfficeBasePageComponent extends PracticeableBasePageComponent {

  commonPageState: CommonOfficePageState;

  protected constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    public navController: NavController,
  ) {
    super(platform, authenticationProvider, router, store$);
  }

  onInitialisation(): void {
    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.commonPageState = {
      activityCode$: currentTest$.pipe(
        select(getActivityCode),
      ),
    };
  }

  async completeTest() {
    if (!this.isPracticeMode) {
      this.store$.dispatch(CompleteTest());
    }
    await this.popToRoot();
  }

  async popToRoot() {
    if (this.isPracticeMode) {
      this.exitPracticeMode();
      return;
    }
    await this.navController.navigateBack(JOURNAL_PAGE);
  }

  async defer() {
    await this.popToRoot();
    this.store$.dispatch(SavingWriteUpForLater());
    this.store$.dispatch(PersistTests());
  }

}

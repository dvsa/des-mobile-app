import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { StoreModel } from '@shared/models/store.model';
import { getCurrentTest, getActivityCode } from '@store/tests/tests.selector';
import { getTests } from '@store/tests/tests.reducer';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { ActivityCodeModel } from '@shared/constants/activity-code/activity-code.constants';

import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';

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

}

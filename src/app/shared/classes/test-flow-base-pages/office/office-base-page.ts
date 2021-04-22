import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

import { StoreModel } from '@shared/models/store.model';
import { getCurrentTest, getActivityCode } from '@store/tests/tests.selector';
import { getTests } from '@store/tests/tests.reducer';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { ActivityCodeModel } from '@shared/constants/activity-code/activity-code.constants';

import { BasePageComponent } from '../../base-page';

export interface CommonOfficePageState {
  activityCode$: Observable<ActivityCodeModel>;
}

export abstract class OfficeBasePageComponent extends BasePageComponent {

  commonPageState: CommonOfficePageState;

  protected constructor(
    protected store$: Store<StoreModel>,
    protected platform: Platform,
    protected authenticationProvider: AuthenticationProvider,
    protected router: Router,
  ) {
    super(platform, authenticationProvider, router);
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

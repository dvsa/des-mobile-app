import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import {
  selectIsEndToEndPracticeTest,
  selectIsPracticeMode,
  selectIsTestReportPracticeTest,
} from '@store/tests/tests.selector';
import { Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FAKE_JOURNAL_PAGE } from '@pages/page-names.constants';
import { StoreModel } from '../models/store.model';
import { BasePageComponent } from './base-page';

export abstract class PracticeableBasePageComponent extends BasePageComponent {
  public isPracticeMode: boolean = this.store$.selectSignal(selectIsPracticeMode)();
  public isEndToEndPracticeMode: boolean = this.store$.selectSignal(selectIsEndToEndPracticeTest)();
  public isTestReportPracticeMode: boolean = this.store$.selectSignal(selectIsTestReportPracticeTest)();

  protected constructor(
    public platform: Platform,
    public authenticationProvider: AuthenticationProvider,
    public router: Router,
    public store$: Store<StoreModel>,
    @Inject(true) public loginRequired: boolean = true,
  ) {
    super(platform, authenticationProvider, router, loginRequired);
  }

  exitPracticeMode = async () => {
    await this.router.navigate([FAKE_JOURNAL_PAGE]);
  };

}

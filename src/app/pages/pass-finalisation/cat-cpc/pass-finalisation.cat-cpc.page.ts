import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { merge, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { FormGroup } from '@angular/forms';

import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { behaviourMap } from '@pages/office/office-behaviour-map.cat-cpc';
import {
  CommonPassFinalisationPageState,
  PassFinalisationPageComponent,
} from '@shared/classes/test-flow-base-pages/pass-finalisation/pass-finalisation-base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { StoreModel } from '@shared/models/store.model';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { PersistTests } from '@store/tests/tests.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import {
  PASS_CERTIFICATE_NUMBER_CTRL,
} from '@pages/pass-finalisation/components/pass-certificate-number/pass-certificate-number.constants';
import {
  PassFinalisationReportActivityCode,
  PassFinalisationValidationError,
} from '@pages/pass-finalisation/pass-finalisation.actions';

interface CatCPCPassFinalisationPageState {
  testCategory$: Observable<CategoryCode>;
}

type PassFinalisationPageState = CommonPassFinalisationPageState & CatCPCPassFinalisationPageState;

@Component({
  selector: 'app-pass-finalisation-cat-cpc',
  templateUrl: './pass-finalisation.cat-cpc.page.html',
  styleUrls: ['./../pass-finalisation.page.scss'],
})
export class PassFinalisationCatCPCPage extends PassFinalisationPageComponent implements OnInit {

  form: FormGroup;
  pageState: PassFinalisationPageState;
  merged$: Observable<string | boolean>;
  subscription: Subscription;
  testCategory: TestCategory;

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    public routeByCat: RouteByCategoryProvider,
    private outcomeBehaviourProvider: OutcomeBehaviourMapProvider,
  ) {
    super(platform, authenticationProvider, router, store$);
    this.form = new FormGroup({});
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
  }

  ngOnInit(): void {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );

    this.pageState = {
      ...this.commonPageState,
      testCategory$: currentTest$.pipe(
        select(getTestCategory),
      ),
    };

    const { testCategory$ } = this.pageState;

    this.merged$ = merge(
      testCategory$.pipe(map((value) => this.testCategory = value as TestCategory)),
    );
  }

  ionViewWillEnter(): boolean {
    super.ionViewWillEnter();
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

  async onSubmit(): Promise<void> {
    Object.keys(this.form.controls).forEach((controlName) => this.form.controls[controlName].markAsDirty());

    if (this.form.valid) {
      this.store$.dispatch(PersistTests());
      this.store$.dispatch(PassFinalisationReportActivityCode(this.testOutcome));
      await this.routeByCat.navigateToPage(TestFlowPageNames.HEALTH_DECLARATION_PAGE);
      return;
    }

    Object.keys(this.form.controls).forEach((controlName) => {
      if (this.form.controls[controlName].invalid) {
        if (controlName === PASS_CERTIFICATE_NUMBER_CTRL) {
          this.store$.dispatch(PassFinalisationValidationError(`${controlName} is invalid`));
        }
        this.store$.dispatch(PassFinalisationValidationError(`${controlName} is blank`));
      }
    });
  }

}

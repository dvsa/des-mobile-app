import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import {
  CommonPassFinalisationPageState,
  PassFinalisationPageComponent,
} from '@shared/classes/test-flow-base-pages/pass-finalisation/pass-finalisation-base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ActivityCodes } from '@shared/models/activity-codes';
import {
  PassFinalisationValidationError,
  PassFinalisationViewDidEnter,
} from '@pages/pass-finalisation/pass-finalisation.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { PersistTests } from '@store/tests/tests.actions';
import { D255No } from '@store/tests/test-summary/test-summary.actions';
import { behaviourMap } from '../../office/office-behaviour-map.cat-adi-part2';

interface CatADI2PassFinalisationPageState {}
type PassFinalisationPageState = CommonPassFinalisationPageState & CatADI2PassFinalisationPageState;

@Component({
  selector: 'app-pass-finalisation-cat-adi-part2',
  templateUrl: './pass-finalisation.cat-adi-part2.page.html',
  styleUrls: ['./../pass-finalisation.page.scss'],
})
export class PassFinalisationCatADI2Page extends PassFinalisationPageComponent implements OnInit {
  pageState: PassFinalisationPageState;
  form: FormGroup;
  testOutcome: string = ActivityCodes.PASS;
  merged$: Observable<string | boolean>;
  subscription: Subscription;

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

    this.pageState = {
      ...this.commonPageState,
    };

    // Dispatching this action as D255 is not present in ADI pt2, but it is a mandatory field in TARS
    this.store$.dispatch(D255No());
  }

  ionViewWillEnter(): boolean {
    super.ionViewWillEnter();
    this.store$.dispatch(PassFinalisationViewDidEnter());
    return true;
  }

  async onSubmit(): Promise<void> {
    Object.keys(this.form.controls).forEach((controlName) => this.form.controls[controlName].markAsDirty());

    if (this.form.valid) {
      this.store$.dispatch(PersistTests());
      await this.routeByCat.navigateToPage(TestFlowPageNames.CONFIRM_TEST_DETAILS_PAGE);
      return;
    }

    Object.keys(this.form.controls).forEach((controlName) => {
      if (this.form.controls[controlName].invalid) {
        this.store$.dispatch(PassFinalisationValidationError(`${controlName} is blank`));
      }
    });
  }

}

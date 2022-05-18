import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { PersistTests } from '@store/tests/tests.actions';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { behaviourMap } from '@pages/office/office-behaviour-map.cat-home-test';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import {
  CommonPassFinalisationPageState,
  PassFinalisationPageComponent,
} from '@shared/classes/test-flow-base-pages/pass-finalisation/pass-finalisation-base-page';
import { Router } from '@angular/router';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { PASS_CERTIFICATE_NUMBER_CTRL } from '../components/pass-certificate-number/pass-certificate-number.constants';
import {
  PassFinalisationViewDidEnter,
  PassFinalisationValidationError,
  PassFinalisationReportActivityCode,
} from '../pass-finalisation.actions';
import { TestFlowPageNames } from '../../page-names.constants';

interface CatHomePassFinalisationPageState {}
type PassFinalisationPageState = CommonPassFinalisationPageState & CatHomePassFinalisationPageState;

@Component({
  selector: 'app-pass-finalisation-cat-home-test',
  templateUrl: './pass-finalisation.cat-home-test.page.html',
  styleUrls: ['./../pass-finalisation.page.scss'],
})
export class PassFinalisationCatHomeTestPage extends PassFinalisationPageComponent {
  pageState: PassFinalisationPageState;
  form: FormGroup;

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

    this.pageState = { ...this.commonPageState };
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(PassFinalisationViewDidEnter());
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

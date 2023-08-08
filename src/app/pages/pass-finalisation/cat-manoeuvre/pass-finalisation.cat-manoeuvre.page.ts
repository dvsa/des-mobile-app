import { Component, OnInit } from '@angular/core';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import {
  CommonPassFinalisationPageState,
  PassFinalisationPageComponent,
} from '@shared/classes/test-flow-base-pages/pass-finalisation/pass-finalisation-base-page';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { UntypedFormGroup } from '@angular/forms';
import { behaviourMap } from '@pages/office/office-behaviour-map.cat-cm';
import { PersistTests } from '@store/tests/tests.actions';
import {
  PASS_CERTIFICATE_NUMBER_CTRL,
} from '@pages/pass-finalisation/components/pass-certificate-number/pass-certificate-number.constants';
import {
  PassFinalisationReportActivityCode,
  PassFinalisationValidationError,
  PassFinalisationViewDidEnter,
} from '@pages/pass-finalisation/pass-finalisation.actions';

type PassFinalisationPageState = CommonPassFinalisationPageState;

@Component({
  selector: 'app-pass-finalisation-cat-manoeuvre',
  templateUrl: './pass-finalisation.cat-manoeuvre.page.html',
  styleUrls: ['./../pass-finalisation.page.scss'],
})
export class PassFinalisationCatManoeuvrePage extends PassFinalisationPageComponent implements OnInit {

  form: UntypedFormGroup;
  pageState: PassFinalisationPageState;

  constructor(
    public routeByCat: RouteByCategoryProvider,
    private outcomeBehaviourProvider: OutcomeBehaviourMapProvider,
  ) {
    super();
    this.form = new UntypedFormGroup({});
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);
  }

  ngOnInit(): void {
    super.onInitialisation();

    this.pageState = {
      ...this.commonPageState,
    };
  }

  ionViewDidEnter() {
    this.store$.dispatch(PassFinalisationViewDidEnter());
  }

  async onSubmit(): Promise<void> {
    Object.keys(this.form.controls)
      .forEach((controlName) => this.form.controls[controlName].markAsDirty());

    if (this.form.valid) {
      this.store$.dispatch(PersistTests());
      this.store$.dispatch(PassFinalisationReportActivityCode(this.testOutcome));
      await this.routeByCat.navigateToPage(TestFlowPageNames.HEALTH_DECLARATION_PAGE);
      return;
    }

    Object.keys(this.form.controls)
      .forEach((controlName) => {
        if (this.form.controls[controlName].invalid) {
          if (controlName === PASS_CERTIFICATE_NUMBER_CTRL) {
            this.store$.dispatch(PassFinalisationValidationError(`${controlName} is invalid`));
          }
          this.store$.dispatch(PassFinalisationValidationError(`${controlName} is blank`));
        }
      });
  }

}

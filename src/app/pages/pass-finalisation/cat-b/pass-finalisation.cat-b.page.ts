import { Component, OnInit, computed, effect } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { behaviourMap } from '@pages/office/office-behaviour-map';
import { TestFlowPageNames } from '@pages/page-names.constants';
import {
  PassFinalisationReportActivityCode,
  PassFinalisationValidationError,
  PassFinalisationViewDidEnter,
} from '@pages/pass-finalisation/pass-finalisation.actions';
import { PassFinalisationPageComponent } from '@shared/classes/test-flow-base-pages/pass-finalisation/pass-finalisation-base-page';
import { ProvisionalLicenseNotReceived } from '@store/tests/pass-completion/pass-completion.actions';
import { PersistTests } from '@store/tests/tests.actions';
import { PASS_CERTIFICATE_NUMBER_CTRL } from '../components/pass-certificate-number/pass-certificate-number.constants';

@Component({
  selector: 'app-pass-finalisation-cat-b-page',
  templateUrl: './pass-finalisation.cat-b.page.html',
  styleUrls: ['./../pass-finalisation.page.scss'],
  standalone: false,
})
export class PassFinalisationCatBPage extends PassFinalisationPageComponent implements OnInit {
  activityCode: ActivityCode;
  form: UntypedFormGroup;
  candidateDriverNumberValue: string;

  transmissionAutomaticRadioChecked = computed(() => this.transmissionSignal() === 'Automatic');
  transmissionManualRadioChecked = computed(() => this.transmissionSignal() === 'Manual');

  niMessage: string =
    'This candidate holds a Northern Irish licence and must retain it. Do not collect ' + 'it from the candidate.';

  constructor() {
    super();
    this.form = new UntypedFormGroup({});
    this.outcomeBehaviourProvider.setBehaviourMap(behaviourMap);

    effect(() => {
      this.activityCode = this.testOutcomeCode();
    });

    effect(() => {
      this.candidateDriverNumberValue = this.candidateDriverNumber();
    });

    effect(() => {
      if (this.transmissionAutomaticRadioChecked()) {
        this.form.controls.transmissionCtrl?.setValue('Automatic');
      }

      if (this.transmissionManualRadioChecked()) {
        this.form.controls.transmissionCtrl?.setValue('Manual');
      }
    });
  }

  ngOnInit(): void {
    super.onInitialisation();
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(PassFinalisationViewDidEnter());
  }

  async onSubmit() {
    Object.keys(this.form.controls).forEach((controlName) => this.form.controls[controlName].markAsDirty());
    if (this.isNorthernIreland(this.candidateDriverNumberValue)) {
      this.store$.dispatch(ProvisionalLicenseNotReceived());
    }
    if (this.form.valid) {
      this.store$.dispatch(PersistTests());
      this.store$.dispatch(PassFinalisationReportActivityCode(this.activityCode));
      await this.routeByCat.navigateToPage(TestFlowPageNames.HEALTH_DECLARATION_PAGE);
      return;
    }
    Object.keys(this.form.controls).forEach((controlName) => {
      if (this.form.controls[controlName].invalid) {
        if (controlName === PASS_CERTIFICATE_NUMBER_CTRL) {
          this.store$.dispatch(PassFinalisationValidationError(`${controlName} is invalid`));
          return;
        }
        this.store$.dispatch(PassFinalisationValidationError(`${controlName} is blank`));
      }
    });
  }

  /**
   * Test input against pattern, sanitising spaces
   * @param driverNumber
   */
  isNorthernIreland(driverNumber: string): boolean {
    return /^\d+$/.test(driverNumber?.replace(/\s/g, ''));
  }
}

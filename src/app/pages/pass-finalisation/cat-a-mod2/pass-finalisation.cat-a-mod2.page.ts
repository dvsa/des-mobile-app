import { Component, OnInit } from '@angular/core';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import {
  CommonPassFinalisationPageState,
  PassFinalisationPageComponent,
} from '@shared/classes/test-flow-base-pages/pass-finalisation/pass-finalisation-base-page';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { UntypedFormGroup } from '@angular/forms';
import { merge, Observable, Subscription } from 'rxjs';
import { GearboxCategory } from '@dvsa/mes-test-schema/categories/common';
import { map } from 'rxjs/operators';
import { PersistTests } from '@store/tests/tests.actions';
import {
  PASS_CERTIFICATE_NUMBER_CTRL,
} from '@pages/pass-finalisation/components/pass-certificate-number/pass-certificate-number.constants';
import {
  PassFinalisationReportActivityCode,
  PassFinalisationValidationError,
  PassFinalisationViewDidEnter,
} from '@pages/pass-finalisation/pass-finalisation.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { TransmissionType } from '@shared/models/transmission-type';
import { behaviourMap } from '../../office/office-behaviour-map.cat-a-mod2';

type PassFinalisationPageState = CommonPassFinalisationPageState;

@Component({
  selector: 'app-pass-finalisation-cat-a-mod2',
  templateUrl: './pass-finalisation.cat-a-mod2.page.html',
  styleUrls: ['./../pass-finalisation.page.scss'],
})
export class PassFinalisationCatAMod2Page extends PassFinalisationPageComponent implements OnInit {

  pageState: PassFinalisationPageState;
  form: UntypedFormGroup;
  merged$: Observable<string | boolean>;
  transmission: GearboxCategory;
  subscription: Subscription;

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

    const {
      transmission$,
    } = this.pageState;

    this.merged$ = merge(
      transmission$.pipe(map((value) => this.transmission = value)),
    );
  }

  ionViewWillEnter(): boolean {
    super.ionViewWillEnter();
    this.store$.dispatch(PassFinalisationViewDidEnter());

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

  displayTransmissionBanner(): boolean {
    return !this.form.controls['transmissionCtrl'].pristine && this.transmission === TransmissionType.Automatic;
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

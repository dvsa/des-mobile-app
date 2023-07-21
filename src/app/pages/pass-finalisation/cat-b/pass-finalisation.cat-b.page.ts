import {
  Component, ElementRef, OnInit, ViewChild,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { merge, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ActivityCode, GearboxCategory } from '@dvsa/mes-test-schema/categories/common';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getVehicleDetails } from '@store/tests/vehicle-details/cat-home-test/vehicle-details.reducer';
import { isAutomatic, isManual } from '@store/tests/vehicle-details/vehicle-details.selector';
import { PersistTests } from '@store/tests/tests.actions';
import {
  PassFinalisationReportActivityCode,
  PassFinalisationValidationError,
  PassFinalisationViewDidEnter,
} from '@pages/pass-finalisation/pass-finalisation.actions';
import {
  CommonPassFinalisationPageState,
  PassFinalisationPageComponent,
} from '@shared/classes/test-flow-base-pages/pass-finalisation/pass-finalisation-base-page';
import { TransmissionType } from '@shared/models/transmission-type';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { StoreModel } from '@shared/models/store.model';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { behaviourMap } from '@pages/office/office-behaviour-map';
import { ProvisionalLicenseNotReceived } from '@store/tests/pass-completion/pass-completion.actions';
import { PASS_CERTIFICATE_NUMBER_CTRL } from '../components/pass-certificate-number/pass-certificate-number.constants';

interface PassFinalisationCatBPageState {
  transmissionAutomaticRadioChecked$: Observable<boolean>;
  transmissionManualRadioChecked$: Observable<boolean>;
}

type PassFinalisationPageState = CommonPassFinalisationPageState & PassFinalisationCatBPageState;

@Component({
  selector: 'app-pass-finalisation-cat-b-page',
  templateUrl: './pass-finalisation.cat-b.page.html',
  styleUrls: ['./../pass-finalisation.page.scss'],
})
export class PassFinalisationCatBPage extends PassFinalisationPageComponent implements OnInit {
  pageState: PassFinalisationPageState;
  @ViewChild('passCertificateNumberInput') passCertificateNumberInput: ElementRef;
  activityCode: ActivityCode;
  form: UntypedFormGroup;
  merged$: Observable<string>;
  transmission: GearboxCategory;
  candidateDriverNumber: string;
  subscription: Subscription;
  niMessage: string = 'This candidate holds a Northern Irish licence and must retain it. Do not collect '
    + 'it from the candidate.';

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    public routeByCat: RouteByCategoryProvider,
    private outcomeBehaviourProvider: OutcomeBehaviourMapProvider,
  ) {
    super(platform, authenticationProvider, router, store$);
    this.form = new UntypedFormGroup({});
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
      transmissionAutomaticRadioChecked$: currentTest$.pipe(
        select(getVehicleDetails),
        map(isAutomatic),
        tap((val) => {
          if (val) this.form.controls['transmissionCtrl'].setValue('Automatic');
        }),
      ),
      transmissionManualRadioChecked$: currentTest$.pipe(
        select(getVehicleDetails),
        map(isManual),
        tap((val) => {
          if (val) this.form.controls['transmissionCtrl'].setValue('Manual');
        }),
      ),
    };
    const {
      transmission$,
      candidateDriverNumber$,
      testOutcome$,
    } = this.pageState;

    this.merged$ = merge(
      transmission$.pipe(map((value) => this.transmission = value)),
      candidateDriverNumber$.pipe(map((value) => this.candidateDriverNumber = value)),
      testOutcome$.pipe(map((value) => this.activityCode = value)),
    );
    this.subscription = this.merged$.subscribe();
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(PassFinalisationViewDidEnter());
    if (this.subscription.closed && this.merged$) {
      this.subscription = this.merged$.subscribe();
    }
  }

  displayTransmissionBanner(): boolean {
    return !this.form.controls['transmissionCtrl'].pristine && this.transmission === TransmissionType.Automatic;
  }

  async onSubmit() {
    Object.keys(this.form.controls)
      .forEach((controlName) => this.form.controls[controlName].markAsDirty());
    if (this.isNorthernIreland(this.candidateDriverNumber)) {
      this.store$.dispatch(ProvisionalLicenseNotReceived());
    }
    if (this.form.valid) {
      this.store$.dispatch(PersistTests());
      this.store$.dispatch(PassFinalisationReportActivityCode(this.activityCode));
      await this.routeByCat.navigateToPage(TestFlowPageNames.HEALTH_DECLARATION_PAGE);
      return;
    }
    Object.keys(this.form.controls)
      .forEach((controlName) => {
        if (this.form.controls[controlName].invalid) {
          if (controlName === PASS_CERTIFICATE_NUMBER_CTRL) {
            this.store$.dispatch(PassFinalisationValidationError(`${controlName} is invalid`));
            return;
          }
          this.store$.dispatch(PassFinalisationValidationError(`${controlName} is blank`));
        }
      });
  }

  isNorthernIreland(driverNumber: string): boolean {
    driverNumber = driverNumber?.replace(/\s/g, '');
    return /^\d+$/.test(driverNumber);
  }
}

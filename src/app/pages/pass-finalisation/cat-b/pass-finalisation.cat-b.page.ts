import {
  Component, ViewChild, ElementRef, OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { isNumeric } from 'rxjs/internal-compatibility';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription, merge } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GearboxCategory } from '@dvsa/mes-test-schema/categories/common';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getVehicleDetails } from '@store/tests/vehicle-details/vehicle-details.reducer';
import { isAutomatic, isManual } from '@store/tests/vehicle-details/vehicle-details.selector';
import { PersistTests } from '@store/tests/tests.actions';
import {
  PassFinalisationValidationError,
  PassFinalisationViewDidEnter,
} from '@pages/pass-finalisation/pass-finalisation.actions';
import { CommonPassFinalisationPageState, PassFinalisationPageComponent }
  from '@shared/classes/test-flow-base-pages/pass-finalisation/pass-finalisation-base-page';
import { TransmissionType } from '@shared/models/transmission-type';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { ActivityCodes } from '@shared/models/activity-codes';
import { StoreModel } from '@shared/models/store.model';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { behaviourMap } from '@pages/office/office-behaviour-map';
import { PASS_CERTIFICATE_NUMBER_CTRL } from '../components/pass-certificate-number/pass-certificate-number.constants';

interface PassFinalisationCatBPageState {
  candidateUntitledName$: Observable<string>;
  candidateDriverNumber$: Observable<string>;
  testOutcomeText$: Observable<string>;
  applicationNumber$: Observable<string>;
  provisionalLicense$: Observable<boolean>;
  passCertificateNumber$: Observable<string>;
  transmission$: Observable<GearboxCategory>;
  transmissionAutomaticRadioChecked$: Observable<boolean>;
  transmissionManualRadioChecked$: Observable<boolean>;
  d255$: Observable<boolean>;
  debriefWitnessed$: Observable<boolean>;
  conductedLanguage$: Observable<string>;
  eyesightTestFailed$: Observable<boolean>;
}

type PassFinalisationPageState = CommonPassFinalisationPageState & PassFinalisationCatBPageState;

@Component({
  selector: 'app-pass-finalisation-cat-b-page',
  templateUrl: './pass-finalisation.cat-b.page.html',
  styleUrls: ['./../pass-finalisation.page.scss'],
})
export class PassFinalisationCatBPage extends PassFinalisationPageComponent implements OnInit {
  pageState: PassFinalisationPageState;
  @ViewChild('passCertificateNumberInput')
  passCertificateNumberInput: ElementRef;
  testOutcome: string = ActivityCodes.PASS;
  form: FormGroup;
  merged$: Observable<string>;
  transmission: GearboxCategory;
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
    const { transmission$ } = this.pageState;

    this.merged$ = merge(
      transmission$.pipe(map((value) => this.transmission = value)),
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
    Object.keys(this.form.controls).forEach((controlName) => this.form.controls[controlName].markAsDirty());
    if (this.form.valid) {
      this.store$.dispatch(PersistTests());
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
  isNorthernIreland(driverNumber: string): boolean {
    driverNumber = driverNumber.replace(/\s/g, '');
    return isNumeric(driverNumber);
  }
}

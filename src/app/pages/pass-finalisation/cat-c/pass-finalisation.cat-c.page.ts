import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import {
  CommonPassFinalisationPageState,
  PassFinalisationPageComponent,
} from '@shared/classes/test-flow-base-pages/pass-finalisation/pass-finalisation-base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { UntypedFormGroup } from '@angular/forms';
import { Observable, Subscription, merge } from 'rxjs';
import { GearboxCategory } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { map } from 'rxjs/operators';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getTests } from '@store/tests/tests.reducer';
import { getPassCompletion } from '@store/tests/pass-completion/cat-c/pass-completion.cat-c.reducer';
import { getCode78 } from '@store/tests/pass-completion/cat-c/pass-completion.cat-c.selector';
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
import { behaviourMap } from '../../office/office-behaviour-map.cat-c';

interface CatCPassFinalisationPageState {
  code78$: Observable<boolean>;
}

type PassFinalisationPageState = CommonPassFinalisationPageState & CatCPassFinalisationPageState;

@Component({
  selector: 'app-pass-finalisation-cat-c',
  templateUrl: './pass-finalisation.cat-c.page.html',
  styleUrls: ['./../pass-finalisation.page.scss'],
})
export class PassFinalisationCatCPage extends PassFinalisationPageComponent implements OnInit {

  pageState: PassFinalisationPageState;
  form: UntypedFormGroup;
  merged$: Observable<string | boolean>;
  manualMessage: string = 'A <b><em>manual</em></b> licence will be issued';
  automaticMessage: string = 'An <b><em>automatic</em></b> licence will be issued';
  askCandidateLicenseMessage: string = 'Check that the candidate doesn\'t need their driving licence (e.g CPC Mod4)';
  transmission: GearboxCategory;
  subscription: Subscription;
  code78Present: boolean = null;
  provisionalLicenseIsReceived: boolean;
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
      code78$: currentTest$.pipe(
        select(getPassCompletion),
        select(getCode78),
      ),
    };

    const {
      transmission$, code78$, provisionalLicense$, testCategory$,
    } = this.pageState;

    this.merged$ = merge(
      transmission$.pipe(map((value) => this.transmission = value)),
      code78$.pipe(map((value) => this.code78Present = value)),
      provisionalLicense$.pipe(map((value) => this.provisionalLicenseIsReceived = value)),
      testCategory$.pipe(map((value) => this.testCategory = value as TestCategory)),
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

  shouldShowCandidateDoesntNeedLicenseBanner(): boolean {
    return this.provisionalLicenseIsReceived;
  }

  shouldShowCode78Banner(): boolean {
    return this.code78Present !== null && this.transmission !== null;
  }

  shouldShowManualBanner(): boolean {
    if (this.shouldShowCode78Banner()) {
      return (
        this.transmission === TransmissionType.Manual
          || (this.transmission === TransmissionType.Automatic && !this.code78Present)
      );
    }
    return false;
  }

  shouldShowAutomaticBanner(): boolean {
    if (this.shouldShowCode78Banner()) {
      return this.code78Present && this.transmission === TransmissionType.Automatic;
    }
    return false;
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

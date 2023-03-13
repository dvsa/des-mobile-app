import { Component, OnInit } from '@angular/core';
import {
  Platform,
  ModalController,
} from '@ionic/angular';
import { Store } from '@ngrx/store';
import { merge, Observable } from 'rxjs';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { StoreModel } from '@shared/models/store.model';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { Router } from '@angular/router';
import { TestData } from '@dvsa/mes-test-schema/categories/AM1';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import {
  CommonTestReportPageState,
  TestReportBasePageComponent,
} from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { SingleFaultCompetencyNames } from '@store/tests/test-data/test-data.constants';
import { SpeedCheckState } from '@providers/test-report-validator/test-report-validator.constants';
import { competencyLabels } from '@shared/constants/competencies/competencies';
import { ModalEvent } from '@pages/test-report/test-report.constants';
import {
  ModalReason,
} from '@pages/test-report/cat-a-mod1/components/activity-code-4-modal/activity-code-4-modal.constants';
import {
  EmergencyStopDangerousFaultModelOpened,
  EmergencyStopSeriousFaultModelOpened,
  SpeedRequirementNotMetModalOpened,
} from '@pages/test-report/cat-a-mod1/test-report.cat-a-mod1.actions';
import { map } from 'rxjs/operators';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { SpeedCheckModal } from '@pages/test-report/cat-a-mod1/components/speed-check-modal/speed-check-modal';
import {
  ActivityCode4Modal,
} from '@pages/test-report/cat-a-mod1/components/activity-code-4-modal/activity-code-4-modal';
import { EndTestModal } from '@pages/test-report/components/end-test-modal/end-test-modal';
import { EtaInvalidModal } from '../components/eta-invalid-modal/eta-invalid-modal';

type TestReportPageState = CommonTestReportPageState;

@Component({
  selector: '.test-report-cat-a-mod1-page',
  templateUrl: 'test-report.cat-a-mod1.page.html',
  styleUrls: ['test-report.cat-a-mod1.page.scss'],
})
export class TestReportCatAMod1Page extends TestReportBasePageComponent implements OnInit {

  singleFaultCompetencyNames = SingleFaultCompetencyNames;
  pageState: TestReportPageState;
  speedCheckState: SpeedCheckState;

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    modalController: ModalController,
    testReportValidatorProvider: TestReportValidatorProvider,
    screenOrientation: ScreenOrientation,
    insomnia: Insomnia,
    routeByCategory: RouteByCategoryProvider,
  ) {
    super(
      platform,
      authenticationProvider,
      router,
      store$,
      modalController,
      testReportValidatorProvider,
      screenOrientation,
      insomnia,
      routeByCategory,
    );
    this.displayOverlay = false;
  }

  ngOnInit(): void {
    super.onInitialisation();

    this.pageState = {
      ...this.commonPageState,
      testData$: this.commonPageState.testData$ as Observable<TestData>,
    };

    this.setupSubscription();
  }

  setupSubscription() {
    const {
      candidateUntitledName$,
      isRemoveFaultMode$,
      isSeriousMode$,
      isDangerousMode$,
      testData$,
    } = this.pageState;

    this.subscription = merge(
      candidateUntitledName$,
      isRemoveFaultMode$.pipe(map((result) => this.isRemoveFaultMode = result)),
      isSeriousMode$.pipe(map((result) => this.isSeriousMode = result)),
      isDangerousMode$.pipe(map((result) => this.isDangerousMode = result)),
      testData$.pipe(
        map((data) => {
          this.speedCheckState = this.testReportValidatorProvider.validateSpeedChecksCatAMod1(data as TestData);
          this.isEtaValid = this.testReportValidatorProvider.isETAValid(data as TestData, TestCategory.EUAM1);
        }),
      ),
    ).subscribe();
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
    this.subscription?.unsubscribe();
  }

  onEndTestClick = async () => {
    let modal: HTMLIonModalElement = await this.createEtaInvalidModal();

    if (modal === null) {
      modal = await this.createSpeedCheckModal();
    }

    if (modal === null) {
      modal = await this.createActivityCode4Modal();
    }

    if (modal === null) {
      modal = await this.createEndTestModal();
    }

    await modal.present();
    const { data } = await modal.onDidDismiss<ModalEvent>();
    await this.onModalDismiss(data);
  };

  createEtaInvalidModal(): Promise<HTMLIonModalElement | null> {
    if (!this.isEtaValid) {
      return this.modalController.create({
        component: EtaInvalidModal,
        componentProps: {},
        cssClass: 'mes-modal-alert text-zoom-regular',
      });
    }
    return null;
  }

  createSpeedCheckModal(): Promise<HTMLIonModalElement | null> {
    switch (this.speedCheckState) {
      case SpeedCheckState.EMERGENCY_STOP_AND_AVOIDANCE_MISSING:
        return this.modalController.create({
          component: SpeedCheckModal,
          componentProps: {
            speedChecksNeedCompleting: [competencyLabels.speedCheckEmergency, competencyLabels.speedCheckAvoidance],
          },
          cssClass: 'mes-modal-alert text-zoom-regular',
        });
      case SpeedCheckState.EMERGENCY_STOP_MISSING:
        return this.modalController.create({
          component: SpeedCheckModal,
          componentProps: {
            speedChecksNeedCompleting: [competencyLabels.speedCheckEmergency],
          },
          cssClass: 'mes-modal-alert text-zoom-regular',
        });
      case SpeedCheckState.AVOIDANCE_MISSING:
        return this.modalController.create({
          component: SpeedCheckModal,
          componentProps: { speedChecksNeedCompleting: [competencyLabels.speedCheckAvoidance] },
          cssClass: 'mes-modal-alert text-zoom-regular',
        });
      default:
        return null;
    }
  }

  createActivityCode4Modal(): Promise<HTMLIonModalElement | null> {
    switch (this.speedCheckState) {
      case SpeedCheckState.NOT_MET:
        this.store$.dispatch(SpeedRequirementNotMetModalOpened());
        return this.modalController.create({
          component: ActivityCode4Modal,
          componentProps: { modalReason: ModalReason.SPEED_REQUIREMENTS },
          cssClass: 'mes-modal-alert text-zoom-regular',
        });
      case SpeedCheckState.EMERGENCY_STOP_DANGEROUS_FAULT:
        this.store$.dispatch(EmergencyStopDangerousFaultModelOpened());
        return this.modalController.create({
          component: ActivityCode4Modal,
          componentProps: { modalReason: ModalReason.EMERGENCY_STOP_DANGEROUS },
          cssClass: 'mes-modal-alert text-zoom-regular',
        });
      case SpeedCheckState.EMERGENCY_STOP_SERIOUS_FAULT:
        this.store$.dispatch(EmergencyStopSeriousFaultModelOpened());
        return this.modalController.create({
          component: ActivityCode4Modal,
          componentProps: { modalReason: ModalReason.EMERGENCY_STOP_SERIOUS },
          cssClass: 'mes-modal-alert text-zoom-regular',
        });
      default:
        return null;
    }
  }

  createEndTestModal(): Promise<HTMLIonModalElement> {
    if (this.speedCheckState === SpeedCheckState.VALID) {
      return this.modalController.create({
        component: EndTestModal,
        componentProps: {},
        cssClass: 'mes-modal-alert text-zoom-regular',
      });
    }
    return null;
  }
}

import { Component, Injector, OnInit } from '@angular/core';
import { Observable, merge } from 'rxjs';

import { TestData } from '@dvsa/mes-test-schema/categories/AM1';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ViewDidLeave } from '@ionic/angular';
import { ActivityCode4Modal } from '@pages/test-report/cat-a-mod1/components/activity-code-4-modal/activity-code-4-modal';
import { ModalReason } from '@pages/test-report/cat-a-mod1/components/activity-code-4-modal/activity-code-4-modal.constants';
import { SpeedCheckModal } from '@pages/test-report/cat-a-mod1/components/speed-check-modal/speed-check-modal';
import {
  EmergencyStopDangerousFaultModelOpened,
  EmergencyStopSeriousFaultModelOpened,
  SpeedRequirementNotMetModalOpened,
} from '@pages/test-report/cat-a-mod1/test-report.cat-a-mod1.actions';
import { EndTestModal } from '@pages/test-report/components/end-test-modal/end-test-modal';
import { ModalEvent } from '@pages/test-report/test-report.constants';
import { SpeedCheckState } from '@providers/test-report-validator/test-report-validator.constants';
import {
  CommonTestReportPageState,
  TestReportBasePageComponent,
} from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { competencyLabels } from '@shared/constants/competencies/competencies';
import { SingleFaultCompetencyNames } from '@store/tests/test-data/test-data.constants';
import { map } from 'rxjs/operators';
import { EtaInvalidModal } from '../components/eta-invalid-modal/eta-invalid-modal';

type TestReportPageState = CommonTestReportPageState;

@Component({
  selector: '.test-report-cat-a-mod1-page',
  templateUrl: 'test-report.cat-a-mod1.page.html',
  styleUrls: ['test-report.cat-a-mod1.page.scss'],
})
export class TestReportCatAMod1Page extends TestReportBasePageComponent implements OnInit, ViewDidLeave {
  singleFaultCompetencyNames = SingleFaultCompetencyNames;
  pageState: TestReportPageState;
  speedCheckState: SpeedCheckState;

  constructor(injector: Injector) {
    super(injector);
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
    const { candidateUntitledName$, isRemoveFaultMode$, isSeriousMode$, isDangerousMode$, testData$ } = this.pageState;

    this.subscription = merge(
      candidateUntitledName$,
      isRemoveFaultMode$.pipe(map((result) => (this.isRemoveFaultMode = result))),
      isSeriousMode$.pipe(map((result) => (this.isSeriousMode = result))),
      isDangerousMode$.pipe(map((result) => (this.isDangerousMode = result))),
      testData$.pipe(
        map((data) => {
          this.speedCheckState = this.testReportValidatorProvider.validateSpeedChecksCatAMod1(data as TestData);
          this.isEtaValid = this.testReportValidatorProvider.isETAValid(data as TestData, TestCategory.EUAM1);
        })
      )
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

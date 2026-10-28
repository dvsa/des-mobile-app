import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonCol, IonContent, IonGrid, IonHeader, IonRow, IonToolbar } from '@ionic/angular';
import {
  CommonTestReportPageState,
  TestReportBasePageComponent,
} from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { Observable } from 'rxjs';
import { TestFlowHeaderComponent } from '../../../../components/common/test-flow-header/test-flow-header.component';
import { CompetencyComponent } from '../components/competency/competency';
import { EcoComponent } from '../components/eco/eco';
import { EtaComponent } from '../components/examiner-takes-action/eta';
import { LegalRequirementComponent } from '../components/legal-requirement/legal-requirement';
import { MultiLegalRequirementComponent } from '../components/multi-legal-requirement/multi-legal-requirement';
import { ReverseLeftPopoverComponent } from '../components/reverse-left-popover/reverse-left-popover';
import { ReverseLeftComponent } from '../components/reverse-left/reverse-left';
import { ToolbarComponent } from '../components/toolbar/toolbar';
import { UncoupleRecoupleComponent } from '../components/uncouple-recouple/uncouple-recouple';
import { PcvDoorExerciseComponent } from './components/pcv-door-exercise/pcv-door-exercise';
import { SafetyQuestionsCatDComponent } from './components/safety-questions/safety-questions.cat-d';
import { VehicleChecksCompactCatDComponent } from './components/vehicle-checks-compact/vehicle-checks-compact.cat-d';

type TestReportPageState = CommonTestReportPageState;

@Component({
  selector: '.test-report-cat-d-page',
  templateUrl: './test-report.cat-d.page.html',
  styleUrls: ['./test-report.cat-d.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    NgClass,
    TestFlowHeaderComponent,
    IonContent,
    ToolbarComponent,
    IonGrid,
    IonRow,
    IonCol,
    MultiLegalRequirementComponent,
    LegalRequirementComponent,
    ReverseLeftComponent,
    ReverseLeftPopoverComponent,
    EcoComponent,
    VehicleChecksCompactCatDComponent,
    SafetyQuestionsCatDComponent,
    NgStyle,
    UncoupleRecoupleComponent,
    PcvDoorExerciseComponent,
    EtaComponent,
    CompetencyComponent,
    AsyncPipe,
  ],
})
export class TestReportCatDPage extends TestReportBasePageComponent implements OnInit {
  pageState: TestReportPageState;

  constructor(injector: Injector) {
    super(injector);
    this.displayOverlay = false;
  }

  ngOnInit(): void {
    super.onInitialisation();

    this.pageState = {
      ...this.commonPageState,
      testData$: this.commonPageState.testData$ as Observable<CatDUniqueTypes.TestData>,
    };
    this.setupSubscription();
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
    super.cancelSubscription();
  }

  showUncoupleRecouple = (): boolean => {
    if (!this.isDelegated) {
      return false;
    }
    return this.testCategory === TestCategory.DE || this.testCategory === TestCategory.D1E;
  };
}

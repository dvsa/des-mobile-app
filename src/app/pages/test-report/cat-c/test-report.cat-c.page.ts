import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonCol, IonContent, IonGrid, IonHeader, IonRow, IonToolbar } from '@ionic/angular';
import {
  CommonTestReportPageState,
  TestReportBasePageComponent,
} from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { Observable } from 'rxjs';
import { CompetencyComponent } from '../components/competency/competency';
import { EcoComponent } from '../components/eco/eco';
import { EtaComponent } from '../components/examiner-takes-action/eta';
import { LegalRequirementComponent } from '../components/legal-requirement/legal-requirement';
import { ReverseLeftPopoverComponent } from '../components/reverse-left-popover/reverse-left-popover';
import { ReverseLeftComponent } from '../components/reverse-left/reverse-left';
import { ToolbarComponent } from '../components/toolbar/toolbar';
import { UncoupleRecoupleComponent } from '../components/uncouple-recouple/uncouple-recouple';
import { VehicleChecksComponent } from './components/vehicle-checks/vehicle-checks';

type TestReportPageState = CommonTestReportPageState;

@Component({
  selector: '.test-report-cat-c-page',
  templateUrl: './test-report.cat-c.page.html',
  styleUrls: ['./test-report.cat-c.page.scss'],
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
    LegalRequirementComponent,
    ReverseLeftComponent,
    ReverseLeftPopoverComponent,
    EcoComponent,
    VehicleChecksComponent,
    NgStyle,
    UncoupleRecoupleComponent,
    EtaComponent,
    CompetencyComponent,
    AsyncPipe,
  ],
})
export class TestReportCatCPage extends TestReportBasePageComponent implements OnInit {
  pageState: TestReportPageState;

  constructor(injector: Injector) {
    super(injector);
    this.displayOverlay = false;
  }

  ngOnInit(): void {
    super.onInitialisation();

    this.pageState = {
      ...this.commonPageState,
      testData$: this.commonPageState.testData$ as Observable<CatCUniqueTypes.TestData>,
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
    return this.testCategory === TestCategory.CE || this.testCategory === TestCategory.C1E;
  };
}

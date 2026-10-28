import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { CatFUniqueTypes } from '@dvsa/mes-test-schema/categories/F';
import { CatGUniqueTypes } from '@dvsa/mes-test-schema/categories/G';
import { CatHUniqueTypes } from '@dvsa/mes-test-schema/categories/H';
import { CatKUniqueTypes } from '@dvsa/mes-test-schema/categories/K';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonCol, IonContent, IonGrid, IonHeader, IonRow, IonToolbar } from '@ionic/angular';
import {
  CommonTestReportPageState,
  TestReportBasePageComponent,
} from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { Observable } from 'rxjs';
import { CompetencyComponent } from '../components/competency/competency';
import { ControlledStopComponent } from '../components/controlled-stop/controlled-stop';
import { EcoComponent } from '../components/eco/eco';
import { EtaComponent } from '../components/examiner-takes-action/eta';
import { HighwayCodeSafetyComponent } from '../components/highway-code-safety/highway-code-safety';
import { LegalRequirementComponent } from '../components/legal-requirement/legal-requirement';
import { ReverseLeftPopoverComponent } from '../components/reverse-left-popover/reverse-left-popover';
import { ReverseLeftComponent } from '../components/reverse-left/reverse-left';
import { ToolbarComponent } from '../components/toolbar/toolbar';
import { VehicleChecksComponent } from './components/vehicle-checks/vehicle-checks';

type TestReportPageState = CommonTestReportPageState;

type HomeCatTestDataUnion =
  | CatFUniqueTypes.TestData
  | CatGUniqueTypes.TestData
  | CatHUniqueTypes.TestData
  | CatKUniqueTypes.TestData;

@Component({
  selector: '.test-report-cat-home-test-page',
  templateUrl: './test-report.cat-home-test.page.html',
  styleUrls: ['./test-report.cat-home-test.page.scss'],
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
    NgStyle,
    ReverseLeftComponent,
    ReverseLeftPopoverComponent,
    EcoComponent,
    VehicleChecksComponent,
    HighwayCodeSafetyComponent,
    ControlledStopComponent,
    EtaComponent,
    CompetencyComponent,
    AsyncPipe,
  ],
})
export class TestReportCatHomeTestPage extends TestReportBasePageComponent implements OnInit {
  pageState: TestReportPageState;

  constructor(injector: Injector) {
    super(injector);
    this.displayOverlay = false;
  }

  ngOnInit(): void {
    super.onInitialisation();

    this.pageState = {
      ...this.commonPageState,
      testData$: this.commonPageState.testData$ as Observable<HomeCatTestDataUnion>,
    };
    this.setupSubscription();
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
    super.cancelSubscription();
  }

  showManoeuvreButton = (): boolean => {
    return this.testCategory !== TestCategory.K;
  };
}

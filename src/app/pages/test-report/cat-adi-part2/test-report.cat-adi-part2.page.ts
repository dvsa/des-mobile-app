import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { IonCol, IonContent, IonGrid, IonHeader, IonRow, IonToolbar } from '@ionic/angular';
import {
  CommonTestReportPageState,
  TestReportBasePageComponent,
} from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { Observable } from 'rxjs';
import { TestFlowHeaderComponent } from '../../../../components/common/test-flow-header/test-flow-header.component';
import { CompetencyComponent } from '../components/competency/competency';
import { ControlledStopComponent } from '../components/controlled-stop/controlled-stop';
import { EcoComponent } from '../components/eco/eco';
import { EtaComponent } from '../components/examiner-takes-action/eta';
import { LegalRequirementComponent } from '../components/legal-requirement/legal-requirement';
import { ToolbarComponent } from '../components/toolbar/toolbar';
import { ManoeuvresPopoverComponentAdiPart2 } from './components/manoeuvres-popover/manoeuvres-popover';
import { ManoeuvresComponent } from './components/manoeuvres/manoeuvres';
import { VehicleCheckComponent } from './components/vehicle-check/vehicle-check';

type TestReportPageState = CommonTestReportPageState;

@Component({
  selector: '.test-report-cat-adi-part2-page',
  templateUrl: './test-report.cat-adi-part2.page.html',
  styleUrls: ['./test-report.cat-adi-part2.page.scss'],
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
    ManoeuvresComponent,
    ManoeuvresPopoverComponentAdiPart2,
    EcoComponent,
    VehicleCheckComponent,
    ControlledStopComponent,
    EtaComponent,
    CompetencyComponent,
    AsyncPipe,
  ],
})
export class TestReportCatADI2Page extends TestReportBasePageComponent implements OnInit {
  pageState: TestReportPageState;

  constructor(injector: Injector) {
    super(injector);
    this.displayOverlay = false;
  }

  ngOnInit(): void {
    super.onInitialisation();

    this.pageState = {
      ...this.commonPageState,
      testData$: this.commonPageState.testData$ as Observable<CatADI2UniqueTypes.TestData>,
    };
    this.setupSubscription();
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
    super.cancelSubscription();
  }
}

import { NgClass, NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonCol, IonContent, IonGrid, IonHeader, IonRow, IonToolbar } from '@ionic/angular';
import { ToolbarComponent } from '@pages/test-report/components/toolbar/test-report-toolbar';
import { TestReportBasePageComponent } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { CompetencyComponent } from '../components/competency/competency';
import { ControlledStopComponent } from '../components/controlled-stop/controlled-stop';
import { EcoComponent } from '../components/eco/eco';
import { EtaComponent } from '../components/examiner-takes-action/eta';
import { HighwayCodeSafetyComponent } from '../components/highway-code-safety/highway-code-safety';
import { LegalRequirementComponent } from '../components/legal-requirement/legal-requirement';
import { ReverseLeftPopoverComponent } from '../components/reverse-left-popover/reverse-left-popover';
import { ReverseLeftComponent } from '../components/reverse-left/reverse-left';
import { VehicleChecksComponent } from './components/vehicle-checks/vehicle-checks';

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
  ],
})
export class TestReportCatHomeTestPage extends TestReportBasePageComponent implements OnInit {
  constructor() {
    super();
    this.displayOverlay = false;
  }

  ngOnInit(): void {
    super.onInitialisation();
  }

  showManoeuvreButton = (): boolean => {
    return this.category !== TestCategory.K;
  };
}

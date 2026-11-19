import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { IonCol, IonContent, IonGrid, IonHeader, IonRow, IonToolbar } from '@ionic/angular';
import { ToolbarComponent } from '@pages/test-report/components/toolbar/test-report-toolbar';
import { TestReportBasePageComponent } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { CompetencyComponent } from '../components/competency/competency';
import { ControlledStopComponent } from '../components/controlled-stop/controlled-stop';
import { EcoComponent } from '../components/eco/eco';
import { EtaComponent } from '../components/examiner-takes-action/eta';
import { LegalRequirementComponent } from '../components/legal-requirement/legal-requirement';
import { ManoeuvresPopoverComponentAdiPart2 } from './components/manoeuvres-popover/manoeuvres-popover';
import { ManoeuvresComponent } from './components/manoeuvres/manoeuvres';
import { VehicleCheckComponent } from './components/vehicle-check/vehicle-check';

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
  ],
})
export class TestReportCatADI2Page extends TestReportBasePageComponent implements OnInit {
  constructor() {
    super();
    this.displayOverlay = false;
  }

  ngOnInit(): void {
    super.onInitialisation();
  }
}

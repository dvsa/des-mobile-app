import { Component, OnInit } from '@angular/core';

import { AsyncPipe, NgClass } from '@angular/common';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { IonCol, IonContent, IonGrid, IonHeader, IonRow, IonToolbar } from '@ionic/angular';
import {
  TestReportBasePageComponent,
} from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { CompetencyComponent } from '../components/competency/competency';
import { ControlledStopComponent } from '../components/controlled-stop/controlled-stop';
import { EcoComponent } from '../components/eco/eco';
import { EtaComponent } from '../components/examiner-takes-action/eta';
import { LegalRequirementComponent } from '../components/legal-requirement/legal-requirement';
import { ToolbarComponent } from '../components/toolbar/toolbar';
import { ManoeuvresPopoverComponent } from './components/manoeuvres-popover/manoeuvres-popover';
import { ManoeuvresComponent } from './components/manoeuvres/manoeuvres';
import { VehicleCheckComponent } from './components/vehicle-check/vehicle-check';

@Component({
  selector: '.test-report-cat-b-page',
  templateUrl: 'test-report.cat-b.page.html',
  styleUrls: ['test-report.cat-b.page.scss'],
  standalone: true,
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
    ManoeuvresPopoverComponent,
    EcoComponent,
    VehicleCheckComponent,
    ControlledStopComponent,
    EtaComponent,
    CompetencyComponent,
    AsyncPipe,
  ],
})
export class TestReportCatBPage extends TestReportBasePageComponent implements OnInit {
  constructor() {
    super();
    this.displayOverlay = false;
  }

  ngOnInit(): void {
    super.onInitialisation();
  }
}

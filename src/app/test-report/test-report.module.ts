import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TestReportPage } from './test-report.page';
import { TestReportPageRoutingModule } from './test-report-routing.module';
import { ToolbarComponent } from './components/toolbar/toolbar';
import { CompetencyComponent } from './components/competency/competency';
import { CommonComponentsModule } from '../components/common/common-components.module';
import { CompetencyButtonComponent } from './components/competency-button/competency-button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonComponentsModule,
    TestReportPageRoutingModule,
  ],
  declarations: [
    ToolbarComponent,
    CompetencyComponent,
    CompetencyButtonComponent,
    TestReportPage,
  ],
})
export class TestReportModule { }

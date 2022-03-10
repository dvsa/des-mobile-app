import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssessmentReportComponent } from '@pages/office/cat-cpc/components/assessment-report/assessment-report';
import { PipesModule } from '@shared/pipes/pipes.module';

import { EffectsModule } from '@ngrx/effects';
import { OfficeAnalyticsEffects } from '@pages/office/office.analytics.effects';
import { OfficeEffects } from '@pages/office/office.effects';
import { ComponentsModule } from '@components/common/common-components.module';
import { OfficeComponentsModule } from '@pages/office/components/office.components.module';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import {
  PassCertificateDeclarationComponent,
} from './components/pass-certificate-declaration/pass-certificate-declaration';
import { CombinationComponent } from './components/combination/combination';
import { OfficeCatCPCPage } from './office.cat-cpc.page';
import { OfficeCatCPCPageRoutingModule } from './office.cat-cpc-routing.module';
import {TestFinalisationComponentsModule} from '@components/test-finalisation/test-finalisation-components.module';
import {
  PassFinalisationComponentsModule
} from '@pages/pass-finalisation/components/pass-finalisation-components.module';

@NgModule({
  declarations: [
    OfficeCatCPCPage,
    AssessmentReportComponent,
    CombinationComponent,
    PassCertificateDeclarationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    OfficeCatCPCPageRoutingModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([
      OfficeAnalyticsEffects,
      OfficeEffects,
    ]),
    ComponentsModule,
    OfficeComponentsModule,
    TestFinalisationComponentsModule,
    PassFinalisationComponentsModule,
  ],
  providers: [
    FaultSummaryProvider,
  ],
})
export class OfficeCatCPCPageModule {}

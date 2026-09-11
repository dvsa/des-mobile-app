import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { ComponentsModule } from '@components/common/common-components.module';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TestReportCatADIPart3ComponentsModule } from '@pages/test-report/cat-adi-part3/components/test-report.cat-adi-part3.components.module';
import { TestReportCatCPCComponentsModule } from '@pages/test-report/cat-cpc/components/test-report.cat-cpc.components.module';
import { TestReportComponentsModule } from '@pages/test-report/components/test-report-components.module';
import { TestReportAnalyticsEffects } from '@pages/test-report/test-report.analytics.effects';
import { TestReportEffects } from '@pages/test-report/test-report.effects';
import { testReportReducer } from '@pages/test-report/test-report.reducer';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestResultProvider } from '@providers/test-result/test-result';
import { TestReportCatADI3Page } from './test-report.cat-adi-part3.page';
import { TestReportCatADIPart3PageRoutingModule } from './test-report.cat-adi-part3.routing.module';
import {IonButton, IonCol, IonContent, IonHeader, IonRow, IonText, IonToolbar} from "@ionic/angular";

@NgModule({
  declarations: [TestReportCatADI3Page],
  imports: [
    CommonModule,
    FormsModule,

    TestReportCatADIPart3PageRoutingModule,
    TestReportCatADIPart3ComponentsModule,
    TestReportCatCPCComponentsModule,
    ComponentsModule,
    StoreModule.forFeature('testReport', testReportReducer),
    EffectsModule.forFeature([TestReportAnalyticsEffects, TestReportEffects]),
    TestReportComponentsModule,
    TestFlowHeaderComponent,
    IonCol,
    IonButton,
    IonRow,
    IonText,
    IonToolbar,
    IonHeader,
    IonContent,
  ],
  providers: [TestReportValidatorProvider, TestResultProvider],
})
export class TestReportCatADIPart3PageModule {}

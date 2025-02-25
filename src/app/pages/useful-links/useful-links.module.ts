import { CommonModule } from '@angular/common';
// useful-links.module.ts
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestSlotComponentsModule } from '@components/test-slot/test-slot-components.module';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { DashboardComponentsModule } from '@pages/dashboard/components/dashboard-components.module';
import { TestReportCatADIPart3ComponentsModule } from '@pages/test-report-dashboard/components/test-report-dashboard.components.module';
import { UsefulLinksComponentsModule } from '@pages/useful-links/components/useful-links-components.module';
import { UsefulLinksAnalyticsEffects } from '@pages/useful-links/useful-links.analytics.effects';
import { UsefulLinksPageRoutingModule } from './useful-links-routing.module';
import { UsefulLinksPage } from './useful-links.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsefulLinksPageRoutingModule,
    DashboardComponentsModule,
    TestSlotComponentsModule,
    TestReportCatADIPart3ComponentsModule,
    EffectsModule.forFeature([UsefulLinksAnalyticsEffects]),
    UsefulLinksComponentsModule,
  ],
  declarations: [UsefulLinksPage],
})
export class UsefulLinksPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';
import { ViewTestResultAnalyticsEffects } from '@pages/view-test-result/view-test-result.analytics.effects';
import { ViewTestResultPage } from '@pages/view-test-result/view-test-result.page';
import { ViewTestResultComponentsModule } from '@pages/view-test-result/components/view-test-result.components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ViewTestResultComponentsModule,
    EffectsModule.forFeature([
      ViewTestResultAnalyticsEffects,
    ]),
  ],
  declarations: [
    ViewTestResultPage,
  ],
})
export class ViewTestResultPageModule {}

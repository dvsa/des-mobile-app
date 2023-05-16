import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';

import { RekeyUploadOutcomeAnalyticsEffects } from '@pages/rekey-upload-outcome/rekey-upload-outcome.analytics.effects';
import { ComponentsModule } from '@components/common/common-components.module';
import { RekeyUploadOutcomePageRoutingModule } from './rekey-upload-outcome.routing.module';
import { RekeyUploadOutcomePage } from './rekey-upload-outcome.page';

@NgModule({
  declarations: [RekeyUploadOutcomePage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RekeyUploadOutcomePageRoutingModule,
    EffectsModule.forFeature([RekeyUploadOutcomeAnalyticsEffects]),
    ComponentsModule,
  ],
})
export class RekeyUploadOutcomePageModule {}

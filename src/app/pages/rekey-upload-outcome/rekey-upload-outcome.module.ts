import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';

import { RekeyUploadOutcomeAnalyticsEffects } from '@pages/rekey-upload-outcome/rekey-upload-outcome.analytics.effects';
import { RekeyUploadOutcomePage } from './rekey-upload-outcome.page';
import { RekeyUploadOutcomePageRoutingModule } from './rekey-upload-outcome.routing.module';

@NgModule({
  declarations: [RekeyUploadOutcomePage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RekeyUploadOutcomePageRoutingModule,
    EffectsModule.forFeature([RekeyUploadOutcomeAnalyticsEffects]),
  ],
})
export class RekeyUploadOutcomePageModule {}

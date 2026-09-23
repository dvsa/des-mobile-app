import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';

import { RekeyUploadOutcomeAnalyticsEffects } from '@pages/rekey-upload-outcome/rekey-upload-outcome.analytics.effects';
import { RekeyUploadOutcomePage } from './rekey-upload-outcome.page';
import { RekeyUploadOutcomePageRoutingModule } from './rekey-upload-outcome.routing.module';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [RekeyUploadOutcomePage],
  imports: [
    IonicComponentsModule,
    CommonModule,
    FormsModule,

    RekeyUploadOutcomePageRoutingModule,
    EffectsModule.forFeature([RekeyUploadOutcomeAnalyticsEffects]),
  ],
})
export class RekeyUploadOutcomePageModule {}

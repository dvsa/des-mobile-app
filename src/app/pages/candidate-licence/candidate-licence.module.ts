import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { OfficeComponentsModule } from '@pages/office/components/office.components.module';
import {
  CandidateLicenceComponentsModule,
} from '@pages/candidate-licence/components/candidate-licence.components.module';
import { EffectsModule } from '@ngrx/effects';
import { CandidateLicenceEffects } from '@pages/candidate-licence/candidate-licence.effects';
import { CandidateLicenceAnalyticsEffects } from '@pages/candidate-licence/candidate-licence.analytics.effects';
import {
  CandidateDetailsComponentsModule,
} from '@pages/candidate-details/components/candidate-details-components.module';
import { CandidateLicencePageRoutingModule } from './candidate-licence-routing.module';
import { CandidateLicencePage } from './candidate-licence.page';

@NgModule({
  declarations: [CandidateLicencePage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CandidateLicencePageRoutingModule,
    CandidateLicenceComponentsModule,
    ComponentsModule,
    ReactiveFormsModule,
    OfficeComponentsModule,
    EffectsModule.forFeature([
      CandidateLicenceEffects,
      CandidateLicenceAnalyticsEffects,
    ]),
    CandidateDetailsComponentsModule,
  ],
})
export class CandidateLicencePageModule {}

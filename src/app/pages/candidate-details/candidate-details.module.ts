import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { ComponentsModule } from '@components/common/common-components.module';
import {
  CandidateDetailsComponentsModule,
} from '@pages/candidate-details/components/candidate-details-components.module';
import { CandidateDetailsAnalyticsEffects } from '@pages/candidate-details/candidate-details.analytics.effects';
import { CandidateDetailsPage } from './candidate-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    CandidateDetailsComponentsModule,
    EffectsModule.forFeature([
      CandidateDetailsAnalyticsEffects,
    ]),
  ],
  declarations: [
    CandidateDetailsPage,
  ],
})
export class CandidateDetailsPageModule {
}

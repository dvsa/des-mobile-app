import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { CandidateDetailsAnalyticsEffects } from '@pages/candidate-details/candidate-details.analytics.effects';
import { CandidateDetailsComponentsModule } from '@pages/candidate-details/components/candidate-details-components.module';
import { CandidateDetailsPage } from './candidate-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    CandidateDetailsComponentsModule,
    EffectsModule.forFeature([CandidateDetailsAnalyticsEffects]),
  ],
  declarations: [CandidateDetailsPage],
})
export class CandidateDetailsPageModule {}

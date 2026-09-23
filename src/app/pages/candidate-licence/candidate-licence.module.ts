import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { EffectsModule } from '@ngrx/effects';
import { CandidateDetailsComponentsModule } from '@pages/candidate-details/components/candidate-details-components.module';
import { CandidateLicenceAnalyticsEffects } from '@pages/candidate-licence/candidate-licence.analytics.effects';
import { CandidateLicenceEffects } from '@pages/candidate-licence/candidate-licence.effects';
import { CandidateLicenceComponentsModule } from '@pages/candidate-licence/components/candidate-licence.components.module';
import { OfficeComponentsModule } from '@pages/office/components/office.components.module';
import { CandidateLicencePageRoutingModule } from './candidate-licence-routing.module';
import { CandidateLicencePage } from './candidate-licence.page';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [CandidateLicencePage],
  imports: [
    IonicComponentsModule,
    CommonModule,
    FormsModule,

    CandidateLicencePageRoutingModule,
    CandidateLicenceComponentsModule,
    ComponentsModule,
    ReactiveFormsModule,
    OfficeComponentsModule,
    EffectsModule.forFeature([CandidateLicenceEffects, CandidateLicenceAnalyticsEffects]),
    CandidateDetailsComponentsModule,
    TestFlowHeaderComponent,
  ],
})
export class CandidateLicencePageModule {}

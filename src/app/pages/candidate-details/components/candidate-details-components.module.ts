import { NgModule } from '@angular/core';
import {
  InappropriateUseBannerComponent,
} from '@components/common/inappropriate-use-banner/inappropriate-use-banner';
import { IonicModule } from '@ionic/angular';
import { FitMarkerBannerComponent } from '@components/common/fit-marker-banner/fit-marker-banner';
import {
  CandidateDetailNavigationComponent,
} from '@pages/candidate-details/components/candidate-detail-navigation/candidate-detail-navigation';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@shared/pipes/pipes.module';

@NgModule({
  declarations: [
    InappropriateUseBannerComponent,
    FitMarkerBannerComponent,
    CandidateDetailNavigationComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    PipesModule,
  ],
  exports: [
    InappropriateUseBannerComponent,
    FitMarkerBannerComponent,
    CandidateDetailNavigationComponent,
  ],
})
export class CandidateDetailsComponentsModule { }

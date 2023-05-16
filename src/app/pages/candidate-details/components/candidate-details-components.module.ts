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
import { ComponentsModule } from '@components/common/common-components.module';

@NgModule({
  declarations: [
    InappropriateUseBannerComponent,
    FitMarkerBannerComponent,
    CandidateDetailNavigationComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
  ],
  exports: [
    InappropriateUseBannerComponent,
    FitMarkerBannerComponent,
    CandidateDetailNavigationComponent,
  ],
})
export class CandidateDetailsComponentsModule {
}

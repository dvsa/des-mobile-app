import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { FitMarkerBannerComponent } from '@components/common/fit-marker-banner/fit-marker-banner';
import { InappropriateUseBannerComponent } from '@components/common/inappropriate-use-banner/inappropriate-use-banner';
import { CandidateDetailNavigationComponent } from '@pages/candidate-details/components/candidate-detail-navigation/candidate-detail-navigation';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [InappropriateUseBannerComponent, FitMarkerBannerComponent, CandidateDetailNavigationComponent],
  imports: [IonicComponentsModule, CommonModule, ComponentsModule],
  exports: [InappropriateUseBannerComponent, FitMarkerBannerComponent, CandidateDetailNavigationComponent],
})
export class CandidateDetailsComponentsModule {}

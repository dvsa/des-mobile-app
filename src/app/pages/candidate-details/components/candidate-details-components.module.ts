import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { FitMarkerBannerComponent } from '@components/common/fit-marker-banner/fit-marker-banner';
import { InappropriateUseBannerComponent } from '@components/common/inappropriate-use-banner/inappropriate-use-banner';
import {IonCard, IonCardContent, IonCardHeader, IonCol, IonGrid, IonIcon, IonRow, IonText} from '@ionic/angular';
import { CandidateDetailNavigationComponent } from '@pages/candidate-details/components/candidate-detail-navigation/candidate-detail-navigation';

@NgModule({
  declarations: [InappropriateUseBannerComponent, FitMarkerBannerComponent, CandidateDetailNavigationComponent],
  imports: [CommonModule, ComponentsModule, IonCol, IonIcon, IonRow, IonGrid, IonText, IonCardContent, IonCard, IonCardHeader],
  exports: [InappropriateUseBannerComponent, FitMarkerBannerComponent, CandidateDetailNavigationComponent],
})
export class CandidateDetailsComponentsModule {}

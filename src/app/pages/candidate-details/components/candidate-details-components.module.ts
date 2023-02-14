import { NgModule } from '@angular/core';
import {
  InappropriateUseBannerComponent,
} from '@components/common/inappropriate-use-banner/inappropriate-use-banner';
import { IonicModule } from '@ionic/angular';
import { FitMarkerBannerComponent } from '@components/common/fit-marker-banner/fit-marker-banner';

@NgModule({
  declarations: [
    InappropriateUseBannerComponent,
    FitMarkerBannerComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    InappropriateUseBannerComponent,
    FitMarkerBannerComponent,
  ],
})
export class CandidateDetailsComponentsModule { }

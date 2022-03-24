import { NgModule } from '@angular/core';
import {
  InappropriateUseBannerComponent,
} from '@components/common/inappropriate-use-banner/inappropriate-use-banner';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [InappropriateUseBannerComponent],
  imports: [
    IonicModule,
  ],
  exports: [
    InappropriateUseBannerComponent,
  ],
})
export class CandidateDetailsComponentsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { LicenceInformation } from '@pages/candidate-licence/components/licence-information/licence-information';
import { LicencePhoto } from '@pages/candidate-licence/components/licence-photo/licence-photo';

@NgModule({
  declarations: [
    LicenceInformation,
    LicencePhoto,
  ],
  imports: [
    ComponentsModule,
    IonicModule,
    CommonModule,
  ],
  exports: [
    LicenceInformation,
    LicencePhoto,
  ],
})
export class CandidateLicenceComponentsModule {}

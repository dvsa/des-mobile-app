import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { LicenceDataError } from '@pages/candidate-licence/components/licence-data-error/licence-data-error';
import { LicenceInformation } from '@pages/candidate-licence/components/licence-information/licence-information';
import { LicencePhoto } from '@pages/candidate-licence/components/licence-photo/licence-photo';

@NgModule({
  declarations: [LicenceInformation, LicencePhoto, LicenceDataError],
  imports: [ComponentsModule, IonicModule, CommonModule],
  exports: [LicenceInformation, LicencePhoto, LicenceDataError],
})
export class CandidateLicenceComponentsModule {}

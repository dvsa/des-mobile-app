import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from '@components/common/common-components.module';
import { LicenceDataError } from '@pages/candidate-licence/components/licence-data-error/licence-data-error';
import { LicenceInformation } from '@pages/candidate-licence/components/licence-information/licence-information';
import { LicencePhoto } from '@pages/candidate-licence/components/licence-photo/licence-photo';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [LicenceInformation, LicencePhoto, LicenceDataError],
  imports: [IonicComponentsModule, ComponentsModule, CommonModule],
  exports: [LicenceInformation, LicencePhoto, LicenceDataError],
})
export class CandidateLicenceComponentsModule {}

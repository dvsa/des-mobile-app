import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentsModule } from '@components/common/common-components.module';
import { IonCol, IonGrid, IonIcon, IonRow, IonSpinner, IonText } from '@ionic/angular';
import { LicenceDataError } from '@pages/candidate-licence/components/licence-data-error/licence-data-error';
import { LicenceInformation } from '@pages/candidate-licence/components/licence-information/licence-information';
import { LicencePhoto } from '@pages/candidate-licence/components/licence-photo/licence-photo';

@NgModule({
  declarations: [LicenceInformation, LicencePhoto, LicenceDataError],
  imports: [ComponentsModule, CommonModule, IonIcon, IonCol, IonRow, IonText, IonSpinner, IonGrid],
  exports: [LicenceInformation, LicencePhoto, LicenceDataError],
})
export class CandidateLicenceComponentsModule {}

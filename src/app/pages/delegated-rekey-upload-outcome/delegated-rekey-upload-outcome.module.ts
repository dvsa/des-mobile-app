import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';

import { DelegatedRekeyUploadOutcomePageRoutingModule } from '@pages/delegated-rekey-upload-outcome/delegated-rekey-upload-outcome.routing.module';
import { DelegatedRekeyUploadOutcomePage } from './delegated-rekey-upload-outcome';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [DelegatedRekeyUploadOutcomePage],
  imports: [IonicComponentsModule, ComponentsModule, CommonModule, DelegatedRekeyUploadOutcomePageRoutingModule],
})
export class DelegatedRekeyUploadOutcomePageModule {}

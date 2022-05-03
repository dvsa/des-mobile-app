import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {
  DelegatedRekeyUploadOutcomePageRoutingModule,
} from '@pages/delegated-rekey-upload-outcome/delegated-rekey-upload-outcome.routing.module';
import { DelegatedRekeyUploadOutcomePage } from './delegated-rekey-upload-outcome';

@NgModule({
  declarations: [
    DelegatedRekeyUploadOutcomePage,
  ],
  imports: [
    ComponentsModule,
    IonicModule,
    CommonModule,
    DelegatedRekeyUploadOutcomePageRoutingModule,
  ],
})
export class DelegatedRekeyUploadOutcomePageModule {}

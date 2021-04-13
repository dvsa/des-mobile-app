import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RekeyUploadOutcomePageRoutingModule } from './rekey-upload-outcome.routing.module';

import { RekeyUploadOutcomePage } from './rekey-upload-outcome.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RekeyUploadOutcomePageRoutingModule
  ],
  declarations: [RekeyUploadOutcomePage]
})
export class RekeyUploadOutcomePageModule {}

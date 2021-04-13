import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmTestDetailsPageRoutingModule } from './confirm-test-details-routing.module';

import { ConfirmTestDetailsPage } from './confirm-test-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmTestDetailsPageRoutingModule
  ],
  declarations: [ConfirmTestDetailsPage]
})
export class ConfirmTestDetailsPageModule {}

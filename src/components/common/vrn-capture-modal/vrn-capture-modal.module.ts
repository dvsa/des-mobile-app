import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VRNCaptureModal } from './vrn-capture-modal';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
  ],
  declarations: [
    VRNCaptureModal,
  ],
})
export class VRNCaptureModalModule {}

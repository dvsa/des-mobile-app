import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ExitRekeyModal } from './exit-rekey-modal';

@NgModule({
  declarations: [
    ExitRekeyModal,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    ExitRekeyModal,
  ],
})
export class ExitRekeyModalModule {
}

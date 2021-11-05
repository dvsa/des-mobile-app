import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExitRekeyModal } from './exit-rekey-modal';

@NgModule({
  declarations: [
    ExitRekeyModal,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    ExitRekeyModal,
  ],
})
export class ExitRekeyModalModule {
}

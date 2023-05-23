import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HeaderComponentModule } from '@components/common/header-component/header-component.module';
import { ExitRekeyModal } from './exit-rekey-modal';

@NgModule({
  declarations: [
    ExitRekeyModal,
  ],
  imports: [
    CommonModule,
    IonicModule,
    HeaderComponentModule,
  ],
  exports: [
    ExitRekeyModal,
  ],
})
export class ExitRekeyModalModule {
}

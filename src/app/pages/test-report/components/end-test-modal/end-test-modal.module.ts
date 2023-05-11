import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '@components/common/common-components.module';
import { EndTestModal } from './end-test-modal';

@NgModule({
  declarations: [
    EndTestModal,
  ],
  imports: [
    IonicModule,
    ComponentsModule,
  ],
  exports: [
    EndTestModal,
  ],
})
export class EndTestModalModule { }

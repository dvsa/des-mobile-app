import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EndTestModal } from './end-test-modal';

@NgModule({
  declarations: [
    EndTestModal,
  ],
  imports: [
    IonicPageModule.forChild(EndTestModal),
  ],
  exports: [
    EndTestModal,
  ],
})
export class EndTestModalModule { }

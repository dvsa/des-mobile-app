import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestFinalisationInvalidTestDataModal } from './test-finalisation-invalid-test-data-modal';

@NgModule({
  declarations: [
    TestFinalisationInvalidTestDataModal,
  ],
  imports: [
    IonicPageModule.forChild(TestFinalisationInvalidTestDataModal),
  ],
  exports: [
    TestFinalisationInvalidTestDataModal,
  ],
})
export class TestFinalisationInvalidTestDataModalModule { }

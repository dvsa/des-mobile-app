import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HeaderComponentModule } from '@components/common/header-component/header-component.module';
import { TestFinalisationInvalidTestDataModal } from './test-finalisation-invalid-test-data-modal';

@NgModule({
  declarations: [
    TestFinalisationInvalidTestDataModal,
  ],
  imports: [
    IonicModule,
    HeaderComponentModule,
  ],
  exports: [
    TestFinalisationInvalidTestDataModal,
  ],
})
export class TestFinalisationInvalidTestDataModalModule { }

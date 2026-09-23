import { NgModule } from '@angular/core';

import { TestFinalisationInvalidTestDataModal } from './test-finalisation-invalid-test-data-modal';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [TestFinalisationInvalidTestDataModal],

  exports: [TestFinalisationInvalidTestDataModal],
  imports: [IonicComponentsModule],
})
export class TestFinalisationInvalidTestDataModalModule {}

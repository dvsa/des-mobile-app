import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';

import { Code4Modal } from '@pages/test-report/cat-adi-part3/components/code-4-modal/code-4-modal';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [Code4Modal],
  exports: [Code4Modal],
  imports: [IonicComponentsModule, CommonModule, ComponentsModule],
})
export class Code4ModalModule {}

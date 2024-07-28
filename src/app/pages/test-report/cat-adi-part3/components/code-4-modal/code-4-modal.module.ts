import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { Code4Modal } from '@pages/test-report/cat-adi-part3/components/code-4-modal/code-4-modal';

@NgModule({
	declarations: [Code4Modal],
	exports: [Code4Modal],
	imports: [IonicModule, CommonModule, ComponentsModule],
})
export class Code4ModalModule {}

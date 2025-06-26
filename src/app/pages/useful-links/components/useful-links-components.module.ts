import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { IonicModule } from '@ionic/angular';
import { LinkModalComponent } from '@pages/useful-links/components/link-modal/link-modal.component';

@NgModule({
  declarations: [LinkModalComponent],
  exports: [LinkModalComponent],
  imports: [IonicModule, ComponentsModule, ModalAlertTitleComponent],
})
export class UsefulLinksComponentsModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { IonicModule } from '@ionic/angular';
import { PreviewModeModal } from '@pages/fake-journal/components/preview-mode-modal/preview-mode-modal';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ComponentsModule, ModalAlertTitleComponent],
  declarations: [PreviewModeModal],
})
export class PreviewModeModalModule {}

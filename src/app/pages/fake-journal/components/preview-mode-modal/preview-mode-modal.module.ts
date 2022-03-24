import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '@components/common/common-components.module';
import { PreviewModeModal } from '@pages/fake-journal/components/preview-mode-modal/preview-mode-modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
  ],
  declarations: [
    PreviewModeModal,
  ],
})
export class PreviewModeModalModule {}

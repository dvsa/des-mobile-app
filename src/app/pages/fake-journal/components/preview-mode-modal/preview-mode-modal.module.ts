import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';

import { PreviewModeModal } from '@pages/fake-journal/components/preview-mode-modal/preview-mode-modal';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  imports: [IonicComponentsModule, CommonModule, FormsModule, ComponentsModule],
  declarations: [PreviewModeModal],
})
export class PreviewModeModalModule {}

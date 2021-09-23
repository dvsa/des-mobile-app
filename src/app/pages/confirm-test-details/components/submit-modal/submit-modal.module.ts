import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '@components/common/common-components.module';
import {
  SubmitModal,
} from '@pages/confirm-test-details/components/submit-modal/submit-modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
  ],
  declarations: [
    SubmitModal,
  ],
})
export class JournalEarlyStartModule {}

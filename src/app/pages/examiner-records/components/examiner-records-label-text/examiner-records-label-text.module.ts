import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { ExaminerRecordsLabelTextComponent } from '@pages/examiner-records/components/examiner-records-label-text/examiner-records-label-text';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ComponentsModule],
  declarations: [ExaminerRecordsLabelTextComponent],
  exports: [ExaminerRecordsLabelTextComponent],
})
export class ExaminerRecordsLabelTextComponentModule {}

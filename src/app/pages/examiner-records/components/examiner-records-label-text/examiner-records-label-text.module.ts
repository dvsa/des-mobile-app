import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from '@components/common/common-components.module';
import { ExaminerRecordsLabelTextComponent } from '@pages/examiner-records/components/examiner-records-label-text/examiner-records-label-text';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  imports: [IonicComponentsModule, CommonModule, FormsModule, ComponentsModule],
  declarations: [ExaminerRecordsLabelTextComponent],
  exports: [ExaminerRecordsLabelTextComponent],
})
export class ExaminerRecordsLabelTextComponentModule {}

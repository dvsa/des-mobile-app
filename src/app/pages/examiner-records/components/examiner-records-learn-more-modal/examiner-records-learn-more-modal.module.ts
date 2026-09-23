import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from '@components/common/common-components.module';
import { ExaminerRecordsLearnMoreModal } from '@pages/examiner-records/components/examiner-records-learn-more-modal/examiner-records-learn-more-modal';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  imports: [IonicComponentsModule, CommonModule, FormsModule, ComponentsModule],
  declarations: [ExaminerRecordsLearnMoreModal],
})
export class ExaminerRecordsLearnMoreModalModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { ExaminerRecordsLearnMoreModal } from '@pages/examiner-records/components/examiner-records-learn-more-modal/examiner-records-learn-more-modal';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ComponentsModule],
  declarations: [ExaminerRecordsLearnMoreModal],
})
export class ExaminerRecordsLearnMoreModalModule {}

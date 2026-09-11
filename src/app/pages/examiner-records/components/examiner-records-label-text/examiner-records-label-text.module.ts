import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ComponentsModule } from '@components/common/common-components.module';
import { IonButton, IonCol, IonRow, IonText } from '@ionic/angular';
import { ExaminerRecordsLabelTextComponent } from '@pages/examiner-records/components/examiner-records-label-text/examiner-records-label-text';

@NgModule({
  imports: [CommonModule, FormsModule, ComponentsModule, IonText, IonCol, IonRow, IonButton],
  declarations: [ExaminerRecordsLabelTextComponent],
  exports: [ExaminerRecordsLabelTextComponent],
})
export class ExaminerRecordsLabelTextComponentModule {}

import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '@components/common/common-components.module';
import { ColourFilterRadioComponent } from '@pages/examiner-records/components/colour-filter-radio/colour-filter-radio';
import { ReactiveFormsModule } from '@angular/forms';
import { ExaminerReportsCard } from '@pages/examiner-records/components/examiner-reports-card/examiner-reports-card';

@NgModule({
  declarations: [
    ColourFilterRadioComponent,
    ExaminerReportsCard,
  ],
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ColourFilterRadioComponent,
    ExaminerReportsCard,
  ],
})
export class ExaminerRecordsComponentsModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { ColourFilterRadioComponent } from '@pages/examiner-records/components/colour-filter-radio/colour-filter-radio';
import { ExaminerReportsCard } from '@pages/examiner-records/components/examiner-reports-card/examiner-reports-card';
import { CompressionProvider } from '@providers/compression/compression';

@NgModule({
  declarations: [ColourFilterRadioComponent, ExaminerReportsCard],
  imports: [IonicModule, CommonModule, ComponentsModule, ReactiveFormsModule],
  providers: [CompressionProvider],
  exports: [ColourFilterRadioComponent, ExaminerReportsCard],
})
export class ExaminerRecordsComponentsModule {}

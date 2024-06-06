import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '@components/common/common-components.module';
import { ColourFilterRadioComponent } from '@pages/examiner-records/components/colour-filter-radio/colour-filter-radio';
import { ReactiveFormsModule } from '@angular/forms';
import { ExaminerReportsCard } from '@pages/examiner-records/components/examiner-reports-card/examiner-reports-card';
import { CompressionProvider } from '@providers/compression/compression';
import { MockComponent } from '@pages/examiner-records/components/mockComponent/mock-component';

@NgModule({
  declarations: [
    ColourFilterRadioComponent,
    ExaminerReportsCard,
    MockComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
  ],
  providers: [
    CompressionProvider,
  ],
  exports: [
    ColourFilterRadioComponent,
    ExaminerReportsCard,
    MockComponent,
  ],
})
export class ExaminerRecordsComponentsModule { }

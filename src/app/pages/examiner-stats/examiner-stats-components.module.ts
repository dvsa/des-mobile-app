import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '@components/common/common-components.module';
import { ColourFilterRadioComponent } from '@pages/examiner-stats/components/colour-filter-radio/colour-filter-radio';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ColourFilterRadioComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ColourFilterRadioComponent,
  ],
})
export class ExaminerStatsComponentsModule { }

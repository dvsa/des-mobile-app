import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IonCol } from '@ionic/angular';
import { ReverseManoeuvreComponent } from '@pages/test-report/cat-manoeuvre/components/reverse-manoeuvre/reverse-manoeuvre';
import { TestReportComponentsModule } from '../../components/test-report-components.module';

@NgModule({
  imports: [CommonModule, TestReportComponentsModule, IonCol, ReverseManoeuvreComponent],
  exports: [ReverseManoeuvreComponent],
})
export class TestReportCatManoeuvreComponentsModule {}

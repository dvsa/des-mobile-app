import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';

import { IonCol } from '@ionic/angular';
import { ReverseManoeuvreComponent } from '@pages/test-report/cat-manoeuvre/components/reverse-manoeuvre/reverse-manoeuvre';
import { TestReportComponentsModule } from '../../components/test-report-components.module';

@NgModule({
  declarations: [ReverseManoeuvreComponent],
  imports: [CommonModule, ComponentsModule, TestReportComponentsModule, IonCol],
  exports: [ReverseManoeuvreComponent],
})
export class TestReportCatManoeuvreComponentsModule {}

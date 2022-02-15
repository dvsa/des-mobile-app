import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '@components/common/common-components.module';
import {
  ReverseManoeuvreComponent,
} from '@pages/test-report/cat-manoeuvre/components/reverse-manoeuvre/reverse-manoeuvre';
import { TestReportComponentsModule } from '../../components/test-report-components.module';

@NgModule({
  declarations: [
    ReverseManoeuvreComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    ComponentsModule,
    TestReportComponentsModule,
  ],
  exports: [
    ReverseManoeuvreComponent,
  ],
})
export class TestReportCatManoeuvreComponentsModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestReport.CatBePageRoutingModule } from './test-report.cat-be-routing.module';

import { TestReport.CatBePage } from './test-report.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestReport.CatBePageRoutingModule
  ],
  declarations: [TestReport.CatBePage]
})
export class TestReport.CatBePageModule {}

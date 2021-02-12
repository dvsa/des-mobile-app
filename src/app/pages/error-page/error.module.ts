import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ErrorPage } from './error';
import { ComponentsModule } from '../../../components/common/common-components.module';
@NgModule({
  declarations: [
    ErrorPage,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ComponentsModule,
  ],
  exports: [
    ErrorPage,
  ],
})
export class ErrorPageModule { }

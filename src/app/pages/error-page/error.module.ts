import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '@components/common/common-components.module';
import { ErrorPage } from './error';

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

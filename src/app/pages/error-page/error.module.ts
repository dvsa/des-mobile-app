import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';

import { ErrorPage } from './error';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [ErrorPage],
  imports: [IonicComponentsModule, CommonModule, ComponentsModule],
  exports: [ErrorPage],
})
export class ErrorPageModule {}

import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ErrorPage } from './error';
import { ComponentsModule } from '../../../components/common/common-components.module';

@NgModule({
  declarations: [
    ErrorPage,
  ],
  imports: [
    ComponentsModule,
    IonicModule,
  ],
  exports: [
    ErrorPage,
  ],
})
export class ErrorPageModule { }

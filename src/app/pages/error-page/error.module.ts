import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ErrorPage } from './error';
import { ErrorMessageModule } from '../../../components/common/error-message/error-message.module';

@NgModule({
  declarations: [
    ErrorPage,
  ],
  imports: [
    // ComponentsModule,
    IonicModule,
    ErrorMessageModule,
  ],
  exports: [
    ErrorPage,
  ],
})
export class ErrorPageModule { }

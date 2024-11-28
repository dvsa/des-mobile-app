import { NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CustomDateRangeModal } from './custom-date-range-modal';

@NgModule({
  declarations: [CustomDateRangeModal],
  imports: [IonicModule, NgIf],
  exports: [CustomDateRangeModal],
})
export class CustomDateRangeModalModule {}

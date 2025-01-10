import { NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { CustomCalendarComponent } from '@components/common/datetime-input/custom-calendar-component/custom-calendar.component';
import { IonicModule } from '@ionic/angular';
import { CustomDateRangeModal } from './custom-date-range-modal';

@NgModule({
  declarations: [CustomDateRangeModal],
  imports: [IonicModule, NgIf, CustomCalendarComponent, MatCalendar],
  exports: [CustomDateRangeModal],
})
export class CustomDateRangeModalModule {}

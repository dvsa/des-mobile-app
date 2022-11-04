import { Component } from '@angular/core';
import { IonDatetime } from '@ionic/angular';
import * as moment from 'moment';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'test-start-end-times',
  templateUrl: 'test-start-end-times.html',
  styleUrls: ['test-start-end-times.scss'],
})
export class TestStartEndTimesComponent {
  startTime: string;
  endTime: string;
  // maxStartTime: string = moment.format(yyyy-MM-dd);
  // maxEndTime: string moment.format(yyyy-MM-dd);

  handleClear = (dateTime: IonDatetime, startEnd: 'start' | 'end'): Promise<void> => {
    if (startEnd === 'start') {
      this.startTime = '';
    } else {
      this.endTime = '';
    }
    return dateTime.cancel(true);
  };

  startTimeChanged(startTime: string) {
    console.log('Start Time:', startTime);
  }

  endTimeChanged(endTime: string) {
    console.log('End Time:', endTime);
    // this.maxStartTime = format(parseISO(endTime), 'yyyy-MM-dd');
  }
}

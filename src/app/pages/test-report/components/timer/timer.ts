import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DateTime } from '@shared/helpers/date-time';
import { StoreModel } from '@shared/models/store.model';
import { Dayjs } from 'dayjs';
import { StartTimer } from '../../test-report.actions';

@Component({
  selector: 'timer',
  templateUrl: 'timer.html',
  styleUrls: ['timer.scss'],
  standalone: false,
})
export class TimerComponent {
  showStartTimerButton: boolean;
  interval: NodeJS.Timeout;
  seconds: number;
  timerString: string;
  isPaused = true;

  constructor(private store$: Store<StoreModel>) {
    this.showStartTimerButton = true;
    this.seconds = 0;

    this.generateTimerString();
  }

  toggleTimer = (): void => {
    this.isPaused = !this.isPaused;
    this.interval ? this.pauseTimer() : this.startTimer();
  };

  startTimer = (): void => {
    this.showStartTimerButton = false;
    this.interval = setInterval(() => {
      this.seconds += 1;
      this.generateTimerString();
    }, 1000);
    this.store$.dispatch(StartTimer());
  };

  pauseTimer = (): void => {
    clearInterval(this.interval);
    this.interval = undefined;
  };

  generateTimerString = (): void => {
    let date: Dayjs = new DateTime('0000-01-01').dayjs;
    date = date.set('seconds', this.seconds);

    const hours = date.get('hour');
    const minutes = date.get('minute');
    const seconds = date.get('second');

    const showExtraZeroHours = hours < 10;
    const showExtraZeroMinutes = minutes < 10;
    const showExtraZeroSeconds = seconds < 10;

    this.timerString = `${showExtraZeroHours ? '0' : ''}${hours}:${
      showExtraZeroMinutes ? '0' : ''
    }${minutes}:${showExtraZeroSeconds ? '0' : ''}${seconds}`;
  };
}

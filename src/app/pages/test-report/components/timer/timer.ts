import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DateTime } from '@shared/helpers/date-time';
import { StoreModel } from '@shared/models/store.model';
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
    const date: Date = new DateTime('0000-01-01').getAsDate();
    date.setSeconds(this.seconds);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const showExtraZeroHours = hours < 10;
    const showExtraZeroMinutes = minutes < 10;
    const showExtraZeroSeconds = seconds < 10;

    this.timerString = `${showExtraZeroHours ? '0' : ''}${hours}:${
      showExtraZeroMinutes ? '0' : ''
    }${minutes}:${showExtraZeroSeconds ? '0' : ''}${seconds}`;
  };
}

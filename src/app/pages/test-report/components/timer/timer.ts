import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../../../shared/models/store.model';
import { StartTimer } from '../../test-report.actions';

@Component({
  selector: 'timer',
  templateUrl: 'timer.html',
})
export class TimerComponent {

  showStartTimerButton: boolean;

  interval: any;
  seconds: number;
  timerString: string;
  isPaused: boolean = true;

  constructor(private store$: Store<StoreModel>) {
    this.showStartTimerButton = true;
    this.seconds = 0;

    this.generateTimerString();
  }

  toggleTimer = (): void => {
    this.isPaused = !this.isPaused;
    return this.interval ? this.pauseTimer() : this.startTimer();
  }

  startTimer = (): void => {
    this.showStartTimerButton = false;
    this.interval = setInterval(() => {
      this.seconds += 1;
      this.generateTimerString();
    }, 1000);
    this.store$.dispatch(new StartTimer());
  }

  pauseTimer = (): void => {
    clearInterval(this.interval);
    this.interval = undefined;
  }

  generateTimerString = (): void => {
    const date: Date = new Date(1970, 0, 1 , 0 , 0, 0);
    date.setSeconds(this.seconds);

    const showExtraZeroHours = date.getHours() < 10;
    const showExtraZeroMinutes = date.getMinutes() < 10;
    const showExtraZeroSeconds = date.getSeconds() < 10;

    this.timerString = `${
        showExtraZeroHours ? '0' : ''}${date.getHours()}:${
        showExtraZeroMinutes ? '0' : ''}${date.getMinutes()}:${
        showExtraZeroSeconds ? '0' : ''}${date.getSeconds()
      }`;
  }
}

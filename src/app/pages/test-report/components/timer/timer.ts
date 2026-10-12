import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { StartTimer } from '../../test-report.actions';

@Component({
  selector: 'timer',
  templateUrl: 'timer.html',
  styleUrls: ['timer.scss'],
  standalone: false,
})
export class TimerComponent implements OnDestroy {
  showStartTimerButton: boolean;
  interval: NodeJS.Timeout;
  seconds: number;
  timerString: string;
  isPaused = true;
  private startedAt: number;

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
    //Set the started at time to the current time minus the number of seconds we have already counted.
    //This allows us to account for the timer being paused, either by choice or by locking the ipad
    this.startedAt = Date.now() - this.seconds * 1000;
    //Start a time that ticks ever second.
    this.interval = setInterval(() => {
      this.updateElapsedTime();
    }, 1000);
    this.store$.dispatch(StartTimer());
  };

  pauseTimer = (): void => {
    //Stop the ticking timer and wipe all the relevant variables so they can be reset when the timer starts again.
    this.updateElapsedTime();
    clearInterval(this.interval);
    this.interval = undefined;
    this.startedAt = undefined;
  };

  //Destroy the timer when we leave to stop memory related issues.
  ngOnDestroy = (): void => {
    clearInterval(this.interval);
  };

  private updateElapsedTime = (): void => {
    if (this.startedAt === undefined) return;
    //Calculate the amount of seconds that have passed since the timer was started.
    this.seconds = Math.floor((Date.now() - this.startedAt) / 1000);
    this.generateTimerString();
  };

  generateTimerString = (): void => {
    const date: Date = new Date(1970, 0, 1, 0, 0, 0);
    date.setSeconds(this.seconds);

    const showExtraZeroHours = date.getHours() < 10;
    const showExtraZeroMinutes = date.getMinutes() < 10;
    const showExtraZeroSeconds = date.getSeconds() < 10;

    this.timerString = `${showExtraZeroHours ? '0' : ''}${date.getHours()}:${
      showExtraZeroMinutes ? '0' : ''
    }${date.getMinutes()}:${showExtraZeroSeconds ? '0' : ''}${date.getSeconds()}`;
  };
}

import { Injectable, ElementRef } from '@angular/core';
import * as hammerjs from 'hammerjs';

@Injectable()
export class HammerProvider {

  hammerManager: HammerManager;
  pressTime: number = 300;

  init = (element: ElementRef) => {
    this.hammerManager = new hammerjs.Manager(element.nativeElement);
  };

  addPressAndHoldEvent = (action: Function): void => {
    this.hammerManager.add(new hammerjs.Press({
      event: 'pressAndHold',
      time: this.pressTime,
    }));

    this.hammerManager.on('pressAndHold', () => action());
  };

  addPressEvent = (action: Function): void => {
    this.hammerManager.add(new hammerjs.Press({
      event: 'press',
      time: 1,
    }));

    this.hammerManager.on('press', () => action());
  };

}

import { HammerGestureConfig } from '@angular/platform-browser';
import { Injectable } from '@angular/core';

@Injectable()
export class AppGestureConfig extends HammerGestureConfig {

  overrides = {
    press: { time: 30000 }
  };

}

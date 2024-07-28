import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';

/**
 * @hidden
 * This class overrides the default Angular gesture config.
 */
@Injectable()
export class IonicGestureConfig extends HammerGestureConfig {
  overrides = {
    press: { time: 301 },
  };
}

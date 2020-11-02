import { HammerGestureConfig } from '@angular/platform-browser';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root'})
export class CustomHammerConfig extends HammerGestureConfig {

  overrides = {
    press: { time: 30000 }
  };

}

import { ApplicationRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { isPortrait } from '@shared/helpers/is-portrait-mode';

@Injectable()
export class OrientationMonitorProvider {

  isPortraitMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private ref: ApplicationRef,
  ) {
  }

  public async tearDownListener() {
    await ScreenOrientation.removeAllListeners();
  }
  public async monitorOrientation(): Promise<void> {
    // Detect `orientation` upon entry
    const { type: orientationType } = await ScreenOrientation.getCurrentOrientation();

    // Update isPortraitMode$ with current value
    this.isPortraitMode$.next(isPortrait(orientationType));
    this.ref.tick();

    // Listen to orientation change and update isPortraitMode$ accordingly
    ScreenOrientation.addListener(
      'screenOrientationChange',
      ({ type }) => {
        this.isPortraitMode$.next(isPortrait(type));
        this.ref.tick();
      },
    );
  }
}

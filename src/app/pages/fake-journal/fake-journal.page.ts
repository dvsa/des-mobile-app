import { ChangeDetectorRef, Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BasePageComponent } from '@shared/classes/base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Router } from '@angular/router';
import { fakeJournalTestSlots } from '@pages/fake-journal/__mocks__/fake-journal.mock';
import * as moment from 'moment';
import { StoreModel } from '@shared/models/store.model';
import { Store } from '@ngrx/store';
import { FakeJournalDidEnter } from '@pages/fake-journal/fake-journal.actions';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { isPortrait } from '@shared/helpers/is-portrait-mode';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-fake-journal',
  templateUrl: './fake-journal.page.html',
  styleUrls: ['./fake-journal.page.scss'],
})
export class FakeJournalPage extends BasePageComponent {

  dateToDisplay: string;
  slots = fakeJournalTestSlots;
  isPortraitMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    private store$: Store<StoreModel>,
    private cd: ChangeDetectorRef,
  ) {
    super(platform, authenticationProvider, router);

    this.dateToDisplay = moment().format('dddd D MMMM YYYY');
  }

  async ionViewWillEnter() {
    this.store$.dispatch(FakeJournalDidEnter());
    await this.monitorOrientation();
  }

  private async monitorOrientation(): Promise<void> {
    // Detect `orientation` upon entry
    const { type: orientationType } = await ScreenOrientation.getCurrentOrientation();

    // Update isPortraitMode$ with current value
    this.isPortraitMode$.next(isPortrait(orientationType));
    this.cd.detectChanges();

    // Listen to orientation change and update isPortraitMode$ accordingly
    ScreenOrientation.addListener(
      'screenOrientationChange',
      ({ type }) => {
        this.isPortraitMode$.next(isPortrait(type));
        this.cd.detectChanges();
      },
    );
  }

}

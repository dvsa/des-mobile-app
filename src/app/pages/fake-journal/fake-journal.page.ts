import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BasePageComponent } from '@shared/classes/base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Router } from '@angular/router';
import { fakeJournalTestSlots } from '@pages/fake-journal/__mocks__/fake-journal.mock';
import * as moment from 'moment';
import { StoreModel } from '@shared/models/store.model';
import { Store } from '@ngrx/store';
import { FakeJournalDidEnter } from '@pages/fake-journal/fake-journal.actions';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';

@Component({
  selector: 'app-fake-journal',
  templateUrl: './fake-journal.page.html',
  styleUrls: ['./fake-journal.page.scss'],
})
export class FakeJournalPage extends BasePageComponent {

  dateToDisplay: string;
  slots = fakeJournalTestSlots;

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    private store$: Store<StoreModel>,
    public orientationMonitorProvider: OrientationMonitorProvider,
  ) {
    super(platform, authenticationProvider, router);

    this.dateToDisplay = moment().format('dddd D MMMM YYYY');
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(FakeJournalDidEnter());
  }

  async ionViewWillEnter() {
    await this.orientationMonitorProvider.monitorOrientation();
  }
  async ionViewWillLeave() {
    await this.orientationMonitorProvider.tearDownListener();
  }

}

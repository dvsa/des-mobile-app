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
import { DateTimeProvider } from '@providers/date-time/date-time';
import { formatApplicationReference } from '@shared/helpers/formatters';

@Component({
  selector: 'app-fake-journal',
  templateUrl: './fake-journal.page.html',
  styleUrls: ['./fake-journal.page.scss'],
})
export class FakeJournalPage extends BasePageComponent {

  dateToDisplay: string;
  slots = fakeJournalTestSlots;
  selectedDate: string;
  savedColSizes: { appRef: string; width: number; zoomLevel?: string }[] = [];

  formatAppRef = formatApplicationReference;

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    private store$: Store<StoreModel>,
    private dateTimeProvider: DateTimeProvider,
    public orientationMonitorProvider: OrientationMonitorProvider,
  ) {
    super(platform, authenticationProvider, router);

    this.selectedDate = this.dateTimeProvider.now()
      .format('YYYY-MM-DD');
    this.dateToDisplay = moment()
      .format('dddd D MMMM YYYY');
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

  getWidthData(passedAppRef: string) {
    return this.savedColSizes[this.savedColSizes.findIndex(({ appRef }) => appRef === passedAppRef)];
  }

  saveWidthDetails(data: { appRef: string; width: number; zoomLevel?: string }) {
    if (this.savedColSizes.some(({ appRef }) => appRef === data.appRef)) {
      this.savedColSizes[this.savedColSizes.findIndex(({ appRef }) => appRef === data.appRef)] = data;
    } else {
      this.savedColSizes.push(data);
    }
  }
}

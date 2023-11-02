import { Component, Injector } from '@angular/core';
import { BasePageComponent } from '@shared/classes/base-page';
import { fakeJournalTestSlots } from '@pages/fake-journal/__mocks__/fake-journal.mock';
import * as moment from 'moment';
import { StoreModel } from '@shared/models/store.model';
import { Store } from '@ngrx/store';
import { FakeJournalDidEnter } from '@pages/fake-journal/fake-journal.actions';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { DateTimeProvider } from '@providers/date-time/date-time';

@Component({
  selector: 'app-fake-journal',
  templateUrl: './fake-journal.page.html',
  styleUrls: ['./fake-journal.page.scss'],
})
export class FakeJournalPage extends BasePageComponent {

  dateToDisplay: string;
  slots = fakeJournalTestSlots;
  selectedDate: string;

  constructor(
    private store$: Store<StoreModel>,
    private dateTimeProvider: DateTimeProvider,
    public orientationMonitorProvider: OrientationMonitorProvider,
    injector: Injector,
  ) {
    super(injector);

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

}

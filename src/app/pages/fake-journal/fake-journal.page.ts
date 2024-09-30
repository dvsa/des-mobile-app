import { Component, Injector } from '@angular/core';
import { Style } from '@capacitor/status-bar';
import { fakeJournalTestSlots } from '@pages/fake-journal/__mocks__/fake-journal.mock';
import { FakeJournalDidEnter } from '@pages/fake-journal/fake-journal.actions';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { BasePageComponent } from '@shared/classes/base-page';
import { DateTime } from '@shared/helpers/date-time';

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
    private dateTimeProvider: DateTimeProvider,
    private accessibilityService: AccessibilityService,
    public orientationMonitorProvider: OrientationMonitorProvider,
    injector: Injector
  ) {
    super(injector);

    this.selectedDate = this.dateTimeProvider.now().format('YYYY-MM-DD');
    this.dateToDisplay = new DateTime().format('dddd D MMMM YYYY');
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(FakeJournalDidEnter());
  }

  async ionViewWillEnter() {
    await this.accessibilityService.configureStatusBar(Style.Light);
    await this.orientationMonitorProvider.monitorOrientation();
  }

  async ionViewWillLeave() {
    await this.orientationMonitorProvider.tearDownListener();
  }
}

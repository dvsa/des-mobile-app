import { AsyncPipe } from '@angular/common';
import { Component, HostListener, Injector } from '@angular/core';
import { Style } from '@capacitor/status-bar';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { PracticeModeExitButton } from '@components/common/practice-mode-exit-button/practice-mode-exit-button';
import { PracticeModeOptionsBar } from '@components/common/practice-mode-options-bar/practice-mode-options-bar';
import { VehicleRecallsBanner } from '@components/common/vehicle-recall-banner/vehicle-recalls-banner';
import { LocationComponent } from '@components/test-slot/location/location';
import { TestSlotComponent } from '@components/test-slot/test-slot/test-slot';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { IonButtons, IonCol, IonContent, IonHeader, IonRow, IonTitle, IonToolbar } from '@ionic/angular';
import { fakeJournalTestSlots, regenerateFakeTests } from '@pages/fake-journal/__mocks__/fake-journal.mock';
import { FakeJournalDidEnter } from '@pages/fake-journal/fake-journal.actions';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { BasePageComponent } from '@shared/classes/base-page';
import { DateTime } from '@shared/helpers/date-time';
import { JournalNavigationComponent } from '../journal/components/journal-navigation/journal-navigation';

@Component({
  selector: 'app-fake-journal',
  templateUrl: './fake-journal.page.html',
  styleUrls: ['./fake-journal.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    PracticeModeBanner,
    IonRow,
    IonCol,
    IonTitle,
    IonButtons,
    PracticeModeExitButton,
    PracticeModeOptionsBar,
    IonContent,
    JournalNavigationComponent,
    VehicleRecallsBanner,
    LocationComponent,
    TestSlotComponent,
    AsyncPipe,
  ],
})
export class FakeJournalPage extends BasePageComponent {
  dateToDisplay: string;
  slots: TestSlot[] = fakeJournalTestSlots;
  selectedDate: string;
  displayExitPracticeMode = false;

  constructor(
    private dateTimeProvider: DateTimeProvider,
    public accessibilityService: AccessibilityService,
    public orientationMonitorProvider: OrientationMonitorProvider,
    injector: Injector
  ) {
    super(injector);

    this.selectedDate = this.dateTimeProvider.now().format('YYYY-MM-DD');
    this.dateToDisplay = new DateTime().format('dddd D MMMM YYYY');
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange() {
    //This function fires every time the visibility of the page changes,
    //so we can regenerate the fake tests whenever the user opens the page.
    if (document.visibilityState === 'visible') {
      regenerateFakeTests();
    }
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(FakeJournalDidEnter());
  }

  async ionViewWillEnter() {
    await this.accessibilityService.configureStatusBar(Style.Light);
    await this.orientationMonitorProvider.monitorOrientation();
    regenerateFakeTests();
  }

  async ionViewWillLeave() {
    await this.orientationMonitorProvider.tearDownListener();
  }

  /**
   * Opens the exit practice mode row
   */
  onEndPracticeModeClicked() {
    this.displayExitPracticeMode = true;
  }

  /**
   * Closes the exit practice mode row
   */
  closeExitPracticeMode() {
    this.displayExitPracticeMode = false;
  }
}

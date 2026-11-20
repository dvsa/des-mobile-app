import { Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TestSlotComponent } from '@components/test-slot/test-slot/test-slot';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { DASHBOARD_PAGE } from '@pages/page-names.constants';
import {
  UnuploadedTestsReturnToDashboardPressed,
  UnuploadedTestsViewDidEnter,
} from '@pages/unuploaded-tests/unuploaded-tests.actions';
import { getUnsubmittedTestSlots } from '@pages/unuploaded-tests/unuploaded-tests.selector';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { ExaminerRoleDescription } from '@providers/app-config/constants/examiner-role.constants';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DeviceProvider } from '@providers/device/device';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { SlotProvider } from '@providers/slot/slot';
import { BasePageComponent } from '@shared/classes/base-page';
import { selectRole } from '@store/app-config/app-config.selectors';
import { selectEmployeeId, selectEmployeeName } from '@store/app-info/app-info.selectors';
import { getJournalState } from '@store/journal/journal.reducer';
import { getTests } from '@store/tests/tests.reducer';
import { ProfileHeaderComponent } from '../dashboard/components/profile-header/profile-header';

@Component({
  selector: 'unuploaded-tests',
  templateUrl: 'unuploaded-tests.page.html',
  styleUrls: ['unuploaded-tests.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonLabel,
    IonTitle,
    IonContent,
    ProfileHeaderComponent,
    IonText,
    TestSlotComponent,
  ],
})
export class UnuploadedTestsPage extends BasePageComponent {
  private readonly journal = this.store$.selectSignal(getJournalState);
  private readonly tests = this.store$.selectSignal(getTests);
  private readonly selectedEmployeeId = this.store$.selectSignal(selectEmployeeId);
  private readonly selectedRole = this.store$.selectSignal(selectRole);
  readonly employeeName = this.store$.selectSignal(selectEmployeeName);
  readonly employeeId = computed(() => this.getEmployeeNumberDisplayValue(this.selectedEmployeeId()));
  readonly role = computed(() => this.getRoleDisplayValue(this.selectedRole()));
  readonly isPortrait = toSignal(this.orientationMonitorProvider.isPortraitMode$, { initialValue: false });
  readonly slots = computed(() =>
    getUnsubmittedTestSlots(
      this.journal(),
      this.tests(),
      this.dateTimeProvider,
      this.slotProvider,
      this.appConfigProvider.getAppConfig()?.journal?.numberOfDaysToView
    )
  );
  readonly slotData = computed(() => this.slots().map((slot) => slot.slotData));

  constructor(
    public orientationMonitorProvider: OrientationMonitorProvider,
    private dateTimeProvider: DateTimeProvider,
    private slotProvider: SlotProvider,
    private appConfigProvider: AppConfigProvider,
    public deviceProvider: DeviceProvider
  ) {
    super();
  }

  async ionViewWillEnter() {
    await this.orientationMonitorProvider.monitorOrientation();
  }

  async ionViewWillLeave() {
    await this.orientationMonitorProvider.tearDownListener();
  }

  async ionViewDidEnter(): Promise<void> {
    this.store$.dispatch(UnuploadedTestsViewDidEnter());
    await super.unlockDevice();
  }

  async goToDashboard(): Promise<void> {
    this.store$.dispatch(UnuploadedTestsReturnToDashboardPressed());
    await this.router.navigate([DASHBOARD_PAGE], { replaceUrl: true });
  }

  getRoleDisplayValue = (role: string): string => ExaminerRoleDescription[role] || 'Unknown Role';

  getEmployeeNumberDisplayValue = (employeeNumber: string): string => employeeNumber || 'NOT_KNOWN';

  getTestsText = (tests: number): string => (tests === 1 ? 'test' : 'tests');
}

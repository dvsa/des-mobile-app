import { Component, Injector, OnInit } from '@angular/core';
import { selectEmployeeId, selectEmployeeName, selectVersionNumber } from '@store/app-info/app-info.selectors';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectRole } from '@store/app-config/app-config.selectors';
import { ExaminerRoleDescription } from '@providers/app-config/constants/examiner-role.constants';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { UnuploadedTestsViewDidEnter } from '@pages/unuploaded-tests/unuploaded-tests.actions';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { unsubmittedTestSlots$ } from '@pages/unuploaded-tests/unuploaded-tests.selector';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { SlotProvider } from '@providers/slot/slot';
import { BasePageComponent } from '@shared/classes/base-page';
import { DeviceProvider } from '@providers/device/device';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { getJournalState } from '@store/journal/journal.reducer';
import { getTests } from '@store/tests/tests.reducer';

interface UnunploadedTestsPageState {
  unSubmittedTestSlotData$: Observable<TestSlot[]>;
  appVersion$: Observable<string>;
  employeeName$: Observable<string>;
  employeeId$: Observable<string>;
  role$: Observable<string>;
  unSubmittedTestSlots$?: Observable<SlotItem[]>;
}

@Component({
  selector: 'unuploaded-tests',
  templateUrl: 'unuploaded-tests.page.html',
  styleUrls: ['unuploaded-tests.page.scss'],
})
export class UnuploadedTestsPage extends BasePageComponent implements OnInit {
  pageState: UnunploadedTestsPageState;

  constructor(
    public orientationMonitorProvider: OrientationMonitorProvider,
    private dateTimeProvider: DateTimeProvider,
    private slotProvider: SlotProvider,
    private appConfigProvider: AppConfigProvider,
    public deviceProvider: DeviceProvider,
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit() {
    this.pageState = {
      appVersion$: this.store$.select(selectVersionNumber),
      employeeName$: this.store$.select(selectEmployeeName),
      employeeId$: this.store$.select(selectEmployeeId)
        .pipe(map(this.getEmployeeNumberDisplayValue)),
      role$: this.store$.select(selectRole)
        .pipe(map(this.getRoleDisplayValue)),
      unSubmittedTestSlots$: unsubmittedTestSlots$(
        this.store$.select(getJournalState),
        this.store$.select(getTests),
        this.dateTimeProvider,
        this.slotProvider,
        this.appConfigProvider.getAppConfig()?.journal?.numberOfDaysToView
      ),
      unSubmittedTestSlotData$: unsubmittedTestSlots$(
        this.store$.select(getJournalState),
        this.store$.select(getTests),
        this.dateTimeProvider,
        this.slotProvider,
        this.appConfigProvider.getAppConfig()?.journal?.numberOfDaysToView
      ).pipe(map((data) => data.map((slot) => slot.slotData))),
    };
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

  getRoleDisplayValue = (role: string): string => ExaminerRoleDescription[role] || 'Unknown Role';

  getEmployeeNumberDisplayValue = (employeeNumber: string): string => employeeNumber || 'NOT_KNOWN';

  getTestsText = (tests: number): string => tests === 1 ? 'test' : 'tests';
}

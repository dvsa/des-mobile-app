import { Component, OnInit } from '@angular/core';
import { selectEmployeeId, selectEmployeeName, selectVersionNumber } from '@store/app-info/app-info.selectors';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { map } from 'rxjs/operators';
import { selectRole } from '@store/app-config/app-config.selectors';
import { ExaminerRoleDescription } from '@providers/app-config/constants/examiner-role.constants';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { UnuploadedTestsViewDidEnter } from '@pages/unuploaded-tests/unuploaded-tests.actions';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { unsubmittedTestSlotsInDateOrder$ } from '@pages/unuploaded-tests/unuploaded-tests.selector';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { SlotProvider } from '@providers/slot/slot';
import { BasePageComponent } from '@shared/classes/base-page';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { DeviceProvider } from '@providers/device/device';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';

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
    private store$: Store<StoreModel>,
    private dateTimeProvider: DateTimeProvider,
    private slotProvider: SlotProvider,
    private insomnia: Insomnia,
    public deviceProvider: DeviceProvider,
  ) {
    super();
  }

  ngOnInit() {
    this.pageState = {
      appVersion$: this.store$.select(selectVersionNumber),
      employeeName$: this.store$.select(selectEmployeeName),
      employeeId$: this.store$.select(selectEmployeeId)
        .pipe(map(this.getEmployeeNumberDisplayValue)),
      role$: this.store$.select(selectRole)
        .pipe(map(this.getRoleDisplayValue)),
      unSubmittedTestSlots$: unsubmittedTestSlotsInDateOrder$(this.store$, this.dateTimeProvider, this.slotProvider),
      unSubmittedTestSlotData$: unsubmittedTestSlotsInDateOrder$(this.store$, this.dateTimeProvider, this.slotProvider)
        .pipe(map((data) => data.map((slot) => slot.slotData))),
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

    if (super.isIos()) {
      await ScreenOrientation.unlock();
      await this.insomnia.allowSleepAgain();
      await this.deviceProvider.disableSingleAppMode();
    }
  }

  getRoleDisplayValue = (role: string): string => ExaminerRoleDescription[role] || 'Unknown Role';

  getEmployeeNumberDisplayValue = (employeeNumber: string): string => employeeNumber || 'NOT_KNOWN';

  getTestsText = (tests: number): string => tests === 1 ? 'test' : 'tests';
}

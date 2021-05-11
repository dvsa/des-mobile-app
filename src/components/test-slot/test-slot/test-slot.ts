import { Component, Input, OnInit } from '@angular/core';
import { get, isNil } from 'lodash';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import * as moment from 'moment';

import { AppConfigProvider } from '@providers/app-config/app-config';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { SlotProvider } from '@providers/slot/slot';
import {
  CategoryWhitelistProvider,
} from '@providers/category-whitelist/category-whitelist';
import { DelegatedExaminerTestSlot } from '@providers/delegated-rekey-search/mock-data/delegated-mock-data';
import { StoreModel } from '@shared/models/store.model';
import { SlotTypes } from '@shared/models/slot-types';
import { getSlotType } from '@shared/helpers/get-slot-type';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { getTestStatus, getActivityCodeBySlotId, getTestById } from '@store/tests/tests.selector';
import { getTests } from '@store/tests/tests.reducer';
import { isRekey } from '@store/tests/rekey/rekey.selector';
import { getRekeyIndicator } from '@store/tests/rekey/rekey.reducer';
import { vehicleDetails } from './test-slot.constants';
import { SlotComponent } from '../slot/slot';

interface TestSlotComponentState {
  testStatus$: Observable<TestStatus>;
  testActivityCode$: Observable<ActivityCode>;
  isRekey$: Observable<boolean>;
}

@Component({
  selector: 'test-slot',
  templateUrl: 'test-slot.html',
  styleUrls: ['test-slot.scss'],
})
export class TestSlotComponent implements SlotComponent, OnInit {
  @Input()
  slot: TestSlot;

  @Input()
  hasSlotChanged: boolean;

  @Input()
  hasSeenCandidateDetails: boolean;

  @Input()
  showLocation: boolean;

  @Input()
  delegatedTest: boolean = false;

  @Input()
  teamJournalCandidateResult: boolean = false;

  @Input()
  derivedTestStatus: TestStatus | null = null;

  @Input()
  derivedActivityCode: ActivityCode | null = null;

  @Input()
  examinerName: string = null;

  @Input()
  isTeamJournal: boolean = false;

  componentState: TestSlotComponentState;

  constructor(
    public screenOrientation: ScreenOrientation,
    public appConfig: AppConfigProvider,
    public dateTimeProvider: DateTimeProvider,
    public store$: Store<StoreModel>,
    private slotProvider: SlotProvider,
    public categoryWhitelist: CategoryWhitelistProvider,
  ) { }

  ngOnInit(): void {
    const { slotId } = this.slot.slotDetail;
    this.componentState = {
      testStatus$: this.store$.pipe(
        select(getTests),
        select((tests) => this.derivedTestStatus || getTestStatus(tests, slotId)),
      ),
      testActivityCode$: this.store$.pipe(
        select(getTests),
        map((tests) => this.derivedActivityCode || getActivityCodeBySlotId(tests, this.slot.slotDetail.slotId)),
      ),
      isRekey$: this.store$.pipe(
        select(getTests),
        map((tests) => getTestById(tests, this.slot.slotDetail.slotId.toString())),
        filter((test) => test !== undefined),
        select(getRekeyIndicator),
        select(isRekey),
      ),
    };
  }

  isIndicatorNeededForSlot(): boolean {
    const specialNeeds: boolean = this.isSpecialNeedsSlot();
    const checkNeeded: boolean = this.slot.booking.application.entitlementCheck || false;
    const nonStandardTest: boolean = getSlotType(this.slot) !== SlotTypes.STANDARD_TEST;

    return specialNeeds || checkNeeded || nonStandardTest;
  }

  isSpecialNeedsSlot(): boolean {
    const specialNeeds = get(this.slot, 'booking.application.specialNeeds', '');
    return !isNil(specialNeeds) && specialNeeds.length > 0;
  }

  isPortrait(): boolean {
    return this.screenOrientation.type === this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      || this.screenOrientation.type === this.screenOrientation.ORIENTATIONS.PORTRAIT;
  }

  showVehicleDetails(): boolean {
    return vehicleDetails[this.slot.booking.application.testCategory as TestCategory];
  }

  showAdditionalCandidateDetails(): boolean {
    return this.slot.booking.application.testCategory === TestCategory.ADI2;
  }

  canStartTest(): boolean {
    return this.slotProvider.canStartTest(this.slot)
      && this.categoryWhitelist.isWhiteListed(this.slot.booking.application.testCategory as TestCategory);
  }

  canViewCandidateDetails(): boolean {
    const { testPermissionPeriods } = this.appConfig.getAppConfig().journal;
    const currentDateTime = new Date();
    const isWhitelistedForADI: boolean = testPermissionPeriods.some((period) => {
      return (period.testCategory === TestCategory.ADI2 || period.testCategory === TestCategory.ADI3)
        && new Date(period.from) <= currentDateTime
        && (new Date(period.to) >= currentDateTime || period.to === null);
    });
    const slotStart = moment(this.slot.slotDetail.start).startOf('day');
    const maxViewStart = moment(this.getLatestViewableSlotDateTime()).startOf('day');
    return slotStart.isSameOrBefore(maxViewStart) || isWhitelistedForADI;
  }

  getLatestViewableSlotDateTime(): Date {
    const today = moment();
    // add 3 days if current day is friday, 2 if saturday, else add 1
    let daysToAdd;
    if (today.isoWeekday() === 5) {
      daysToAdd = 3;
    } else {
      daysToAdd = today.isoWeekday() === 6 ? 2 : 1;
    }
    return moment().add(daysToAdd, 'days').startOf('day').toDate();
  }

  getExaminerId(): number {
    let returnValue = null;
    if (this.delegatedTest) {
      const slot = this.slot as DelegatedExaminerTestSlot;
      returnValue = slot.examinerId;
    }
    return returnValue;
  }
}

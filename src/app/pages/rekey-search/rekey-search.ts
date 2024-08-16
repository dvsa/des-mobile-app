import { HttpErrorResponse } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { select } from '@ngrx/store';
import { isEmpty } from 'lodash-es';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RekeySearchError, RekeySearchErrorMessages } from '@pages/rekey-search/rekey-search-error-model';
import {
  RekeySearchClearState,
  RekeySearchViewDidEnter,
  SearchBookedTest,
} from '@pages/rekey-search/rekey-search.actions';
import { getRekeySearchState } from '@pages/rekey-search/rekey-search.reducer';
import {
  getBookedTestSlot,
  getHasSearched,
  getIsLoading,
  getRekeySearchError,
} from '@pages/rekey-search/rekey-search.selector';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { BasePageComponent } from '@shared/classes/base-page';

interface RekeySearchPageState {
  isLoading$: Observable<boolean>;
  hasSearched$: Observable<boolean>;
  bookedTestSlot$: Observable<TestSlot>;
  rekeySearchErr$: Observable<RekeySearchError | HttpErrorResponse>;
  isOffline$: Observable<boolean>;
}

@Component({
  selector: 'page-rekey-search',
  templateUrl: './rekey-search.html',
  styleUrls: ['./rekey-search.scss'],
})
export class RekeySearchPage extends BasePageComponent implements OnInit {
  pageState: RekeySearchPageState;
  staffNumber = '';
  applicationReference = '';
  searchResults: TestSlot[] = [];
  focusedElement: string = null;
  isLDTM = false;

  constructor(
    public orientationMonitorProvider: OrientationMonitorProvider,
    private networkStateProvider: NetworkStateProvider,
    private appConfig: AppConfigProvider,
    injector: Injector
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.store$.dispatch(RekeySearchClearState());
    const rekeySearch$ = this.store$.pipe(select(getRekeySearchState));
    this.pageState = {
      isLoading$: rekeySearch$.pipe(map(getIsLoading)),
      hasSearched$: rekeySearch$.pipe(map(getHasSearched)),
      bookedTestSlot$: rekeySearch$.pipe(map(getBookedTestSlot)),
      rekeySearchErr$: rekeySearch$.pipe(map(getRekeySearchError)),
      isOffline$: this.networkStateProvider.isOffline$,
    };

    this.isLDTM = this.appConfig.getAppConfig()?.role === ExaminerRole.LDTM;
  }

  async ionViewDidEnter(): Promise<void> {
    this.store$.dispatch(RekeySearchViewDidEnter());
    await super.unlockDevice();
  }

  async ionViewWillEnter() {
    await this.orientationMonitorProvider.monitorOrientation();
  }

  async ionViewWillLeave() {
    await this.orientationMonitorProvider.tearDownListener();
  }

  applicationReferenceChanged(val: string) {
    this.applicationReference = val;
  }

  staffNumberChanged(val: string) {
    this.staffNumber = val;
  }

  searchTests() {
    this.store$.dispatch(SearchBookedTest(this.applicationReference, this.staffNumber));
  }

  isBookedTestSlotEmpty(bookedTestsSlot: TestSlot) {
    return isEmpty(bookedTestsSlot);
  }

  hasBookingAlreadyBeenCompleted(rekeySearchErr: HttpErrorResponse | RekeySearchError) {
    return rekeySearchErr.message === RekeySearchErrorMessages.BookingAlreadyCompleted;
  }

  setFocus(focus: string): void {
    this.focusedElement = focus;
  }

  disableSearch(applicationReference: string, staffNumber: string, isLDTM: boolean): boolean {
    return applicationReference === '' || (!isLDTM && staffNumber === '');
  }
}

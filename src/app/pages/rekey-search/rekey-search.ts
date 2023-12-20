import { Component, Injector, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { HttpErrorResponse } from '@angular/common/http';
import { select } from '@ngrx/store';
import { isEmpty } from 'lodash-es';

import { RekeySearchError, RekeySearchErrorMessages } from '@pages/rekey-search/rekey-search-error-model';
import { BasePageComponent } from '@shared/classes/base-page';
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
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { NetworkStateProvider } from '@providers/network-state/network-state';

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
  staffNumber: string = '';
  applicationReference: string = '';
  searchResults: TestSlot[] = [];
  focusedElement: string = null;

  constructor(
    public orientationMonitorProvider: OrientationMonitorProvider,
    private networkStateProvider: NetworkStateProvider,
    injector: Injector,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.store$.dispatch(RekeySearchClearState());
    const rekeySearch$ = this.store$.pipe(
      select(getRekeySearchState),
    );
    this.pageState = {
      isLoading$: rekeySearch$.pipe(
        map(getIsLoading),
      ),
      hasSearched$: rekeySearch$.pipe(
        map(getHasSearched),
      ),
      bookedTestSlot$: rekeySearch$.pipe(
        map(getBookedTestSlot),
      ),
      rekeySearchErr$: rekeySearch$.pipe(
        map(getRekeySearchError),
      ),
      isOffline$: this.networkStateProvider.isOffline$,
    };
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

  staffNumberChanged(val: string) {
    this.staffNumber = val;
  }

  applicationReferenceChanged(val: string) {
    this.applicationReference = val;
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

}

import { HttpErrorResponse } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { select } from '@ngrx/store';
import { isEmpty } from 'lodash-es';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AsyncPipe, NgClass } from '@angular/common';
import { OfflineBannerComponent } from '@components/common/offline-banner/offline-banner';
import { TabComponent } from '@components/common/tab/tab';
import { TabsComponent } from '@components/common/tabs/tabs';
import { TestSlotComponent } from '@components/test-slot/test-slot/test-slot';
import { EmojiBlockDirective } from '@directives/emoji-block.directive';
import { InputRestrictionNumbersDirective } from '@directives/input-restriction-numbers.directive';
import { PasteSanitiserDirective } from '@directives/paste-sanitiser';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonRow,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { MaskitoDirective } from '@maskito/angular';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
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
  getIsHalfAnHourLate,
  getIsLoading,
  getRekeySearchError,
} from '@pages/rekey-search/rekey-search.selector';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { BasePageComponent } from '@shared/classes/base-page';
import { bookingReferenceMask, formatBookingReferenceForBackend, maskPredicate } from '@shared/helpers/formatters';
import { selectEmployeeId } from '@store/app-info/app-info.selectors';

interface RekeySearchPageState {
  isLoading$: Observable<boolean>;
  hasSearched$: Observable<boolean>;
  bookedTestSlot$: Observable<TestSlot>;
  rekeySearchErr$: Observable<RekeySearchError | HttpErrorResponse>;
  isOffline$: Observable<boolean>;
  isBookedLessThanHalfAnHourLate$: Observable<boolean>;
  employeeId$: Observable<string>;
}

@Component({
  selector: 'page-rekey-search',
  templateUrl: './rekey-search.html',
  styleUrls: ['./rekey-search.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    OfflineBannerComponent,
    TabsComponent,
    TabComponent,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    NgClass,
    MaskitoDirective,
    IonText,
    InputRestrictionNumbersDirective,
    EmojiBlockDirective,
    PasteSanitiserDirective,
    IonButton,
    IonIcon,
    IonSpinner,
    TestSlotComponent,
    AsyncPipe,
  ],
})
export class RekeySearchPage extends BasePageComponent implements OnInit {
  pageState: RekeySearchPageState;
  staffNumber = '';
  applicationReference = '';
  searchResults: TestSlot[] = [];
  focusedElement: string = null;
  isLDTM = false;
  isUserEnteringApplicationReference = false;

  constructor(
    public orientationMonitorProvider: OrientationMonitorProvider,
    private networkStateProvider: NetworkStateProvider,
    private appConfig: AppConfigProvider,
    injector: Injector
  ) {
    super(injector);
  }

  getBookingReferenceMask = (): MaskitoOptions => bookingReferenceMask;
  getMaskPredicate = (): MaskitoElementPredicate => maskPredicate;

  ngOnInit(): void {
    this.store$.dispatch(RekeySearchClearState());
    const rekeySearch$ = this.store$.pipe(select(getRekeySearchState));
    this.pageState = {
      isLoading$: rekeySearch$.pipe(map(getIsLoading)),
      hasSearched$: rekeySearch$.pipe(map(getHasSearched)),
      bookedTestSlot$: rekeySearch$.pipe(map(getBookedTestSlot)),
      rekeySearchErr$: rekeySearch$.pipe(map(getRekeySearchError)),
      isBookedLessThanHalfAnHourLate$: rekeySearch$.pipe(map(getIsHalfAnHourLate)),
      isOffline$: this.networkStateProvider.isOffline$,
      employeeId$: this.store$.select(selectEmployeeId),
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
    if (val.length > 0) {
      this.isUserEnteringApplicationReference = !Number.isNaN(Number(val[0]));
      this.applicationReference = val?.toUpperCase();
    } else {
      this.isUserEnteringApplicationReference = false;
      this.applicationReference = '';
    }
  }

  staffNumberChanged(val: string) {
    this.staffNumber = val;
  }

  searchTests() {
    this.store$.dispatch(
      SearchBookedTest(formatBookingReferenceForBackend(this.applicationReference), this.staffNumber)
    );
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

  /**
   * Apply a cut-off period of 30mins to any test that is conducted by a different examiner the listed booked examiner
   * @param isTestTimePastCutOff
   * @param usersStaffNumber
   * @param bookingsStaffNumber
   */
  blockTestFromBeingRekeyed(
    isTestTimePastCutOff: boolean,
    usersStaffNumber: string,
    bookingsStaffNumber: string
  ): boolean {
    if (bookingsStaffNumber === usersStaffNumber) return false;
    return isTestTimePastCutOff;
  }
}

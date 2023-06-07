import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { BasePageComponent } from '@shared/classes/base-page';
import { BehaviorSubject, Observable } from 'rxjs';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { RekeySearchError, RekeySearchErrorMessages } from '@pages/rekey-search/rekey-search-error-model';
import { HttpErrorResponse } from '@angular/common/http';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import {
  RekeySearchClearState,
  RekeySearchViewDidEnter,
  SearchBookedTest,
} from '@pages/rekey-search/rekey-search.actions';
import { map } from 'rxjs/operators';
import { getRekeySearchState } from '@pages/rekey-search/rekey-search.reducer';
import {
  getBookedTestSlot,
  getHasSearched,
  getIsLoading,
  getRekeySearchError,
} from '@pages/rekey-search/rekey-search.selector';
import { isEmpty } from 'lodash';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { DeviceProvider } from '@providers/device/device';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { isPortrait } from '@shared/helpers/is-portrait-mode';

interface RekeySearchPageState {
  isLoading$: Observable<boolean>;
  hasSearched$: Observable<boolean>;
  bookedTestSlot$: Observable<TestSlot>;
  rekeySearchErr$: Observable<RekeySearchError | HttpErrorResponse>;
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
  isPortraitMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private cd: ChangeDetectorRef,
    protected platform: Platform,
    protected authenticationProvider: AuthenticationProvider,
    protected router: Router,
    private store$: Store<StoreModel>,
    private insomnia: Insomnia,
    private deviceProvider: DeviceProvider,
  ) {
    super(platform, authenticationProvider, router);
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
    };
  }

  async ionViewDidEnter(): Promise<void> {
    this.store$.dispatch(RekeySearchViewDidEnter());

    if (super.isIos()) {
      await this.insomnia.allowSleepAgain();
      await this.deviceProvider.disableSingleAppMode();
    }
  }

  async ionViewWillEnter() {
    await this.monitorOrientation();
  }

  private async monitorOrientation(): Promise<void> {
    // Detect `orientation` upon entry
    const { type: orientationType } = await ScreenOrientation.getCurrentOrientation();

    // Update isPortraitMode$ with current value
    this.isPortraitMode$.next(isPortrait(orientationType));
    this.cd.detectChanges();

    // Listen to orientation change and update isPortraitMode$ accordingly
    ScreenOrientation.addListener(
      'screenOrientationChange',
      ({ type }) => {
        this.isPortraitMode$.next(isPortrait(type));
        this.cd.detectChanges();
      },
    );
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

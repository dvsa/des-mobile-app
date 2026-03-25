import { HttpErrorResponse } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { ModalController } from '@ionic/angular';
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core';
import { select } from '@ngrx/store';
import {
  DelegatedRekeySearchError,
  DelegatedRekeySearchErrorMessages,
} from '@pages/delegated-rekey-search/delegated-rekey-search-error-model';
import { getDelegatedRekeySearchState } from '@pages/delegated-rekey-search/delegated-rekey-search.reducer';
import {
  getBookedTestSlot,
  getDelegatedRekeySearchError,
  getHasSearched,
  getIsLoading,
} from '@pages/delegated-rekey-search/delegated-rekey-search.selector';
import { ERROR_PAGE } from '@pages/page-names.constants';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { BasePageComponent } from '@shared/classes/base-page';
import { bookingReferenceMask, formatBookingReferenceForBackend, maskPredicate } from '@shared/helpers/formatters';
import { ErrorTypes } from '@shared/models/error-message';
import { isEmpty } from 'lodash-es';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import {
  DelegatedRekeySearchClearState,
  DelegatedRekeySearchViewDidEnter,
  SearchBookedDelegatedTest,
} from './delegated-rekey-search.actions';

interface DelegatedRekeySearchPageState {
  isLoading$: Observable<boolean>;
  hasSearched$: Observable<boolean>;
  bookedTestSlot$: Observable<TestSlot>;
  rekeySearchErr$: Observable<DelegatedRekeySearchError | HttpErrorResponse>;
}

@Component({
  selector: 'page-delegated-rekey-search',
  templateUrl: './delegated-rekey-search.html',
  styleUrls: ['./delegated-rekey-search.scss'],
  standalone: false,
})
export class DelegatedRekeySearchPage extends BasePageComponent implements OnInit {
  pageState: DelegatedRekeySearchPageState;
  delegatedRekeyForm: UntypedFormGroup;
  hasClickedSearch = false;
  maxCallStackHandler = {
    onlySelf: true,
    emitEvent: false,
  };
  applicationReference = '';
  subscription: Subscription = Subscription.EMPTY;
  focusedElement: string = null;
  isUserEnteringApplicationReference = false;

  constructor(
    public orientationMonitorProvider: OrientationMonitorProvider,
    private modalController: ModalController,
    private accessibilityService: AccessibilityService,
    injector: Injector
  ) {
    super(injector);
  }

  getBookingReferenceMask = (): MaskitoOptions => bookingReferenceMask;
  getMaskPredicate = (): MaskitoElementPredicate => maskPredicate;

  ngOnInit(): void {
    this.store$.dispatch(DelegatedRekeySearchClearState());
    const rekeySearch$ = this.store$.pipe(select(getDelegatedRekeySearchState));
    this.pageState = {
      isLoading$: rekeySearch$.pipe(map(getIsLoading)),
      hasSearched$: rekeySearch$.pipe(map(getHasSearched)),
      bookedTestSlot$: rekeySearch$.pipe(map(getBookedTestSlot)),
      rekeySearchErr$: rekeySearch$.pipe(map(getDelegatedRekeySearchError), distinctUntilChanged()),
    };

    this.delegatedRekeyForm = new UntypedFormGroup({});
    this.delegatedRekeyForm.addControl(
      'applicationReferenceInput',
      new UntypedFormControl(null, [
        Validators.required,
        Validators.pattern(/^(?:\d{11}|[A-Za-z] \d{3} \d{3} \d{2}[A-Za-z])$/),
      ])
    );
    this.delegatedRekeyForm.updateValueAndValidity(this.maxCallStackHandler);
  }

  get applicationReferenceInvalid(): boolean {
    return !this.applicationReferenceCtrl.valid;
  }

  ionViewDidEnter() {
    this.store$.dispatch(DelegatedRekeySearchViewDidEnter());
    this.setUpSubscription();
  }

  async ionViewWillEnter() {
    await this.orientationMonitorProvider.monitorOrientation();
  }

  async ionViewWillLeave() {
    await this.orientationMonitorProvider.tearDownListener();
  }

  setUpSubscription() {
    this.subscription = this.pageState.rekeySearchErr$.subscribe((error) => {
      if (!this.hasBookingAlreadyBeenCompleted(error) && this.pageState.hasSearched$) {
        this.showError(error);
      }
    });
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.store$.dispatch(DelegatedRekeySearchClearState());
    this.applicationReference = '';
    this.hasClickedSearch = false;
  }

  applicationReferenceChanged(val: string) {
    if (val === '') {
      this.store$.dispatch(DelegatedRekeySearchClearState());
    }
  }

  onApplicationReferenceInput(val: string) {
    if (val.length > 0) {
      this.isUserEnteringApplicationReference = !Number.isNaN(Number(val[0]));
      this.applicationReference = val?.toUpperCase();
    } else {
      this.isUserEnteringApplicationReference = false;
      this.applicationReference = '';
    }
  }

  searchTests() {
    this.hasClickedSearch = true;
    this.applicationReferenceCtrl.updateValueAndValidity(this.maxCallStackHandler);
    this.applicationReferenceCtrl.markAsDirty();
    if (this.applicationReferenceCtrl.valid) {
      this.store$.dispatch(SearchBookedDelegatedTest(formatBookingReferenceForBackend(this.applicationReference)));
    }
  }

  isBookedTestSlotEmpty(bookedTestsSlot: TestSlot) {
    return isEmpty(bookedTestsSlot);
  }

  hasBookingAlreadyBeenCompleted(rekeySearchErr: HttpErrorResponse | DelegatedRekeySearchError) {
    return rekeySearchErr.message === DelegatedRekeySearchErrorMessages.BookingAlreadyCompleted;
  }

  async showError(error): Promise<void> {
    if (error === undefined || error.message === '') return;

    // Modals are at the same level as the ion-nav so are not getting the zoom level class,
    // this needs to be passed in the create options.
    const zoomClass = `modal-fullscreen ${this.accessibilityService.getTextZoomClass()}`;

    const errorModal = await this.modalController.create({
      component: ERROR_PAGE,
      cssClass: zoomClass,
      componentProps: {
        type: ErrorTypes.SEARCH,
      },
    });
    await errorModal.present();
  }

  setFocus(focus: string): void {
    this.focusedElement = focus;
  }

  get applicationReferenceCtrl(): AbstractControl {
    return this.delegatedRekeyForm.get('applicationReferenceInput');
  }

  clearAppRef() {
    this.applicationReferenceChanged('');
  }
}

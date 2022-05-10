import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { BasePageComponent } from '@shared/classes/base-page';
import { select, Store } from '@ngrx/store';
import { getDelegatedRekeySearchState } from '@pages/delegated-rekey-search/delegated-rekey-search.reducer';
import { StoreModel } from '@shared/models/store.model';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { TestSlot } from '@dvsa/mes-journal-schema';
import {
  DelegatedRekeySearchError,
  DelegatedRekeySearchErrorMessages,
} from '@pages/delegated-rekey-search/delegated-rekey-search-error-model';
import { HttpErrorResponse } from '@angular/common/http';
import {
  getBookedTestSlot, getDelegatedRekeySearchError,
  getHasSearched,
  getIsLoading,
} from '@pages/delegated-rekey-search/delegated-rekey-search.selector';
import {
  AbstractControl, FormControl, FormGroup, Validators,
} from '@angular/forms';
import { ERROR_PAGE } from '@pages/page-names.constants';
import { ErrorTypes } from '@shared/models/error-message';
import { isEmpty } from 'lodash';
import { AppComponent } from '@app/app.component';
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
})
export class DelegatedRekeySearchPage extends BasePageComponent implements OnInit {
  pageState: DelegatedRekeySearchPageState;
  delegatedRekeyForm: FormGroup;
  hasClickedSearch: boolean = false;
  maxCallStackHandler = { onlySelf: true, emitEvent: false };
  applicationReference: string = '';
  subscription: Subscription = Subscription.EMPTY;
  focusedElement: string = null;

  constructor(
    protected platform: Platform,
    protected authenticationProvider: AuthenticationProvider,
    protected router: Router,
    private store$: Store<StoreModel>,
    private modalController: ModalController,
    private app: AppComponent,
  ) {
    super(platform, authenticationProvider, router);
  }

  ngOnInit(): void {
    this.store$.dispatch(DelegatedRekeySearchClearState());
    const rekeySearch$ = this.store$.pipe(
      select(getDelegatedRekeySearchState),
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
        map(getDelegatedRekeySearchError),
        distinctUntilChanged(),
      ),
    };

    this.delegatedRekeyForm = new FormGroup({});
    this.delegatedRekeyForm
      .addControl('applicationReferenceInput', new FormControl(null, [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
      ]));
    this.delegatedRekeyForm.updateValueAndValidity(this.maxCallStackHandler);
  }

  get applicationReferenceInvalid(): boolean {
    return !this.applicationReferenceCtrl.valid;
  }

  ionViewDidEnter() {
    this.store$.dispatch(DelegatedRekeySearchViewDidEnter());
    this.setUpSubscription();
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
    this.applicationReference = val;
  }

  searchTests() {
    this.hasClickedSearch = true;
    this.applicationReferenceCtrl.updateValueAndValidity(this.maxCallStackHandler);

    if (this.applicationReferenceCtrl.valid) {
      this.store$.dispatch(SearchBookedDelegatedTest(this.applicationReference));
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
    const zoomClass = `modal-fullscreen ${this.app.getTextZoomClass()}`;

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
}

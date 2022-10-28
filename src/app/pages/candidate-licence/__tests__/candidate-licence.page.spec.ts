import {
  ComponentFixture, TestBed, waitForAsync,
} from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';
import { configureTestSuite } from 'ng-bullet';
import { Router } from '@angular/router';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { DomSanitizer } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { CandidateLicencePage } from '@pages/candidate-licence/candidate-licence.page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { CandidateLicenceProvider } from '@providers/candidate-licence/candidate-licence';
import { DomSanitizerMock } from '@mocks/angular-mocks/dom-sanitizer.mock';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { PlatformMock } from '@mocks/ionic-mocks/platform-mock';
import { CandidateLicenceProviderMock } from '@providers/candidate-licence/__mocks__/candidate-licence.mock';
import { LicencePhoto } from '@pages/candidate-licence/components/licence-photo/licence-photo';
import { LicenceDataError } from '@pages/candidate-licence/components/licence-data-error/licence-data-error';
import { OfflineBannerComponent } from '@components/common/offline-banner/offline-banner';
import { TrueLikenessComponent } from '@pages/office/components/true-likeness/true-likeness';
import { LicenceInformation } from '@pages/candidate-licence/components/licence-information/licence-information';
import {
  CandidateLicenceDataValidationError,
  CandidateLicenceViewDidEnter,
} from '@pages/candidate-licence/candidate-licence.actions';
import { TrueLikenessToPhotoChanged } from '@store/tests/test-summary/test-summary.actions';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { TestFlowPageNames } from '@pages/page-names.constants';

fdescribe('CandidateLicencePage', () => {
  let component: CandidateLicencePage;
  let fixture: ComponentFixture<CandidateLicencePage>;
  let store$: Store<StoreModel>;
  const initialState = {};

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        CandidateLicencePage,
        MockComponent(OfflineBannerComponent),
        MockComponent(LicencePhoto),
        MockComponent(LicenceDataError),
        MockComponent(TrueLikenessComponent),
        MockComponent(LicenceInformation),
      ],
      imports: [
        ReactiveFormsModule,
      ],
      providers: [
        { provide: DomSanitizer, useClass: DomSanitizerMock },
        { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: CandidateLicenceProvider, useClass: CandidateLicenceProviderMock },
        { provide: Platform, useClass: PlatformMock },
        { provide: Router, useClass: RouterMock },
        provideMockStore({ initialState }),
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(CandidateLicencePage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
  }));

  describe('Class', () => {
    describe('ionViewDidEnter', () => {
      it('should dispatch the view did enter action', () => {
        component.ionViewDidEnter();
        expect(store$.dispatch).toHaveBeenCalledWith(CandidateLicenceViewDidEnter());
      });
    });
    describe('trueLikenessToPhotoChanged', () => {
      it('should dispatch the true likeness action', () => {
        component.trueLikenessToPhotoChanged(true);
        expect(store$.dispatch).toHaveBeenCalledWith(TrueLikenessToPhotoChanged(true));
      });
    });
    describe('onContinue', () => {
      it('should  ', async () => {
        await component.onContinue();
        expect(store$.dispatch).toHaveBeenCalledWith(TrueLikenessToPhotoChanged(true));
      });
    });
  });

  //   async onContinue(): Promise<void> {
  //     Object.keys(this.formGroup.controls)
  //         .forEach((controlName) => this.formGroup.controls[controlName].markAsDirty());
  //
  //     if (this.formGroup.valid) {
  //     await this.router.navigate([TestFlowPageNames.COMMUNICATION_PAGE]);
  //     return;
  //   }
  //
  //   Object.keys(this.formGroup.controls).forEach((controlName) => {
  //     if (this.formGroup.controls[controlName].invalid) {
  //       this.store$.dispatch(CandidateLicenceDataValidationError(`${controlName} is blank`));
  //     }
  //   });
  // }

});

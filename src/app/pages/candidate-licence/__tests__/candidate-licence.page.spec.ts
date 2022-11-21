import {
  ComponentFixture, TestBed, waitForAsync,
} from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';
import { Router } from '@angular/router';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { DomSanitizer } from '@angular/platform-browser';
import {
  FormControl, FormGroup, ReactiveFormsModule, Validators,
} from '@angular/forms';

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
import { DriverPhotograph } from '@dvsa/mes-driver-schema';

describe('CandidateLicencePage', () => {
  let component: CandidateLicencePage;
  let fixture: ComponentFixture<CandidateLicencePage>;
  let store$: Store<StoreModel>;
  let router: Router;
  let domSanitizer: DomSanitizer;
  const initialState = {};

  beforeEach(waitForAsync(() => {
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

    fixture = TestBed.createComponent(CandidateLicencePage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    router = TestBed.inject(Router);
    domSanitizer = TestBed.inject(DomSanitizer);

    spyOn(store$, 'dispatch');
    spyOn(router, 'navigate');

    component.isPracticeMode = false;
    component.formGroup = new FormGroup({
      ctrl1: new FormControl(null, []),
    });
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
    describe('getImage', () => {
      it('should return img when in practice mode', () => {
        component.isPracticeMode = true;
        expect(component.getImage('some img string', null)).toEqual('some img string');
      });
      it('should return null when img not defined', () => {
        expect(component.getImage(null, null)).toEqual(null);
      });
      it('should use the values from driverPhotograph and pass into dom sanitizer method', () => {
        spyOn(domSanitizer, 'bypassSecurityTrustUrl');
        component.driverDataReturned = true;
        component.getImage('some img', {
          photograph: { image: 'licence image', imageFormat: 'image format' },
        } as DriverPhotograph);
        expect(domSanitizer.bypassSecurityTrustUrl).toHaveBeenCalledWith('data:image format;base64,licence image');
      });
    });
    describe('onContinue', () => {
      it('should navigate the user to the COMMUNICATION_PAGE when form is valid', async () => {
        await component.onContinue();
        expect(store$.dispatch).not.toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith([TestFlowPageNames.COMMUNICATION_PAGE]);
      });
      it('should dispatch an action recording the form error', async () => {
        const ctrl2 = new FormControl(null, [Validators.required]);
        component.formGroup.addControl('ctrl2', ctrl2);
        await component.onContinue();
        expect(store$.dispatch).toHaveBeenCalledWith(CandidateLicenceDataValidationError('ctrl2 is blank'));
      });
    });
  });
});

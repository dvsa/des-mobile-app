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
import { CandidateLicenceErr, CandidateLicenceProvider } from '@providers/candidate-licence/candidate-licence';
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
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { TestsModel } from '@store/tests/tests.model';
import moment from 'moment';

describe('CandidateLicencePage', () => {
  let component: CandidateLicencePage;
  let fixture: ComponentFixture<CandidateLicencePage>;
  let store$: Store<StoreModel>;
  let router: Router;
  let domSanitizer: DomSanitizer;
  const initialState = {
    appInfo: { employeeId: '123456' },
    tests: {
      currentTest: {
        slotId: '123',
      },
      testStatus: {},
      startedTests: {
        123: {
          category: TestCategory.B,
          journalData: {
            candidate: {
              dateOfBirth: '1/1/2000',
              candidateName: {
                firstName: 'firstName',
                lastName: 'lastName',
              },
            },
          },
          communicationPreferences: {
            conductedLanguage: 'English',
          },
          testData: {
            ETA: {
              physical: true,
            },
            eco: {
              completed: true,
            },
            seriousFaults: {
              controlsAccelerator: true,
            },
            dangerousFaults: {
              positioningNormalDriving: true,
            },
            drivingFaults: {
              controlsAccelerator: 1,
              judgementOvertaking: 1,
            },
          },
        } as CatBUniqueTypes.TestResult,
      },
    } as TestsModel,
  } as StoreModel;

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
    describe('ngOnInit', () => {
      it('should resolve state variables', () => {
        component.ngOnInit();

        component.pageState.testCategory$.subscribe((val) => {
          expect(val).toEqual(TestCategory.B);
        });
        component.pageState.age$.subscribe((val) => {
          expect(val).toEqual(moment().diff('1/1/2000', 'years'));
        });
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
    describe('setError', () => {
      it('should set offlineError to true if CandidateLicenceErr is OFFLINE', () => {
        component.offlineError = false;

        component['setError']({
          message: CandidateLicenceErr.OFFLINE,
          name: '',
        });

        expect(component.offlineError).toEqual(true);
      });
      it('should set candidateDataUnavailable to true if CandidateLicenceErr is UNAVAILABLE', () => {
        component.candidateDataUnavailable = false;

        component['setError']({
          message: CandidateLicenceErr.UNAVAILABLE,
          name: '',
        });

        expect(component.candidateDataUnavailable).toEqual(true);
      });
      it('should set niLicenceDetected to true if CandidateLicenceErr is NI_LICENCE', () => {
        component.niLicenceDetected = false;

        component['setError']({
          message: CandidateLicenceErr.NI_LICENCE,
          name: '',
        });

        expect(component.niLicenceDetected).toEqual(true);
      });
      it('should set candidateDataError to true if the switch defaults', () => {
        component.candidateDataError = false;

        component['setError']({
          message: null,
          name: '',
        });

        expect(component.candidateDataError).toEqual(true);
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

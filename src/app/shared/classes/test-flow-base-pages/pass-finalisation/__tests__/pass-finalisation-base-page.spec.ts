import {
  waitForAsync,
  TestBed,
} from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { Store } from '@ngrx/store';
import { PlatformMock } from 'ionic-mocks';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { StoreModel } from '@shared/models/store.model';
import { TestsModel } from '@store/tests/tests.model';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { PassFinalisationPageComponent }
  from '@shared/classes/test-flow-base-pages/pass-finalisation/pass-finalisation-base-page';
import {
  PassCertificateNumberChanged,
  ProvisionalLicenseNotReceived,
  ProvisionalLicenseReceived,
} from '@store/tests/pass-completion/pass-completion.actions';
import { GearboxCategoryChanged } from '@store/tests/vehicle-details/vehicle-details.actions';
import {
  D255No, D255Yes, DebriefUnWitnessed, DebriefWitnessed,
} from '@store/tests/test-summary/test-summary.actions';
import {
  CandidateChoseToProceedWithTestInEnglish,
  CandidateChoseToProceedWithTestInWelsh,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PassFinalisationPageComponent', () => {
  let platform: Platform;
  let authenticationProvider: AuthenticationProvider;
  let router: Router;
  let store$: Store<StoreModel>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  let basePageComponent: PassFinalisationPageComponent;
  const initialState = {
    tests: {
      currentTest: { slotId: '1234' },
      startedTests: {
        1234: {
          journalData: {
            candidate: {
              candidateName: {
                title: 'Mr',
                firstName: 'Tim',
                lastName: 'Burr',
              },
            },
          },
        } as TestResultSchemasUnion,
      },
      testStatus: { 1234: TestStatus.Booked },
    } as TestsModel,
  } as StoreModel;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: Router, useValue: routerSpy },
        provideMockStore({ initialState }),
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    platform = TestBed.inject(Platform);
    authenticationProvider = TestBed.inject(AuthenticationProvider);
    // router = TestBed.inject(Router);
    store$ = TestBed.inject(MockStore);

    class BasePageClass extends PassFinalisationPageComponent {
      constructor(
        plat: Platform,
        auth: AuthenticationProvider,
        rout: Router,
        sto$: Store<StoreModel>,
      ) {
        super(plat, auth, rout, sto$);
      }
    }

    basePageComponent = new BasePageClass(
      platform,
      authenticationProvider,
      router, store$,
    );
  }));

  describe('onInitialisation', () => {
    it('should resolve state variables', () => {
      basePageComponent.onInitialisation();
      basePageComponent.commonPageState.candidateName$
        .subscribe((res) => expect(res)
          .toEqual('Mr Tim Burr'));
    });
  });

  describe('provisionalLicenseReceived', () => {
    it('should dispatch the correct action when called', () => {
      spyOn(basePageComponent.store$, 'dispatch');
      basePageComponent.provisionalLicenseReceived();
      expect(store$.dispatch).toHaveBeenCalledWith(ProvisionalLicenseReceived());
      expect(store$.dispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('provisionalLicenseNotReceived', () => {
    it('should dispatch the correct action when called', () => {
      spyOn(basePageComponent.store$, 'dispatch');
      basePageComponent.provisionalLicenseNotReceived();
      expect(store$.dispatch).toHaveBeenCalledWith(ProvisionalLicenseNotReceived());
      expect(store$.dispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('transmissionChanged', () => {
    it('should dispatch the correct action when called', () => {
      spyOn(basePageComponent.store$, 'dispatch');
      basePageComponent.transmissionChanged('Manual');
      expect(store$.dispatch).toHaveBeenCalledWith(GearboxCategoryChanged('Manual'));
      expect(store$.dispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('passCertificateNumberChanged', () => {
    it('should dispatch the correct action when called', () => {
      spyOn(basePageComponent.store$, 'dispatch');
      basePageComponent.passCertificateNumberChanged('1e3f5y64');
      expect(store$.dispatch).toHaveBeenCalledWith(PassCertificateNumberChanged('1e3f5y64'));
      expect(store$.dispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('d255Changed', () => {
    it('should dispatch the correct action if the inputted value is true', () => {
      spyOn(basePageComponent.store$, 'dispatch');
      basePageComponent.d255Changed(true);
      expect(store$.dispatch).toHaveBeenCalledWith(D255Yes());
      expect(store$.dispatch).toHaveBeenCalledTimes(1);
    });
    it('should dispatch the correct action if the inputted value is false', () => {
      spyOn(basePageComponent.store$, 'dispatch');
      basePageComponent.d255Changed(false);
      expect(store$.dispatch).toHaveBeenCalledWith(D255No());
      expect(store$.dispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('debriefWitnessedChanged', () => {
    it('should dispatch the correct action if the inputted value is true', () => {
      spyOn(basePageComponent.store$, 'dispatch');
      basePageComponent.debriefWitnessedChanged(true);
      expect(store$.dispatch).toHaveBeenCalledWith(DebriefWitnessed());
      expect(store$.dispatch).toHaveBeenCalledTimes(1);
    });
    it('should dispatch the correct action if the inputted value is false', () => {
      spyOn(basePageComponent.store$, 'dispatch');
      basePageComponent.debriefWitnessedChanged(false);
      expect(store$.dispatch).toHaveBeenCalledWith(DebriefUnWitnessed());
      expect(store$.dispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('isWelshChanged', () => {
    it('should dispatch the correct action if the isWelsh flag is true', () => {
      spyOn(basePageComponent.store$, 'dispatch');
      basePageComponent.isWelshChanged(true);
      expect(store$.dispatch).toHaveBeenCalledWith(CandidateChoseToProceedWithTestInWelsh('Cymraeg'));
      expect(store$.dispatch).toHaveBeenCalledTimes(1);
    });
    it('should dispatch the correct action if the isWelsh flag is false', () => {
      spyOn(basePageComponent.store$, 'dispatch');
      basePageComponent.isWelshChanged(false);
      expect(store$.dispatch).toHaveBeenCalledWith(CandidateChoseToProceedWithTestInEnglish('English'));
      expect(store$.dispatch).toHaveBeenCalledTimes(1);
    });
  });
});

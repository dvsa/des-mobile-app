import { TestBed, waitForAsync } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { PlatformMock } from '@mocks/index.mock';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { StoreModel } from '@shared/models/store.model';
import { TestsModel } from '@store/tests/tests.model';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import {
  PassFinalisationPageComponent,
} from '@shared/classes/test-flow-base-pages/pass-finalisation/pass-finalisation-base-page';
import {
  Code78NotPresent,
  Code78Present,
  PassCertificateNumberChanged,
  ProvisionalLicenseNotReceived,
  ProvisionalLicenseReceived,
} from '@store/tests/pass-completion/pass-completion.actions';
import { GearboxCategoryChanged } from '@store/tests/vehicle-details/vehicle-details.actions';
import { D255No, D255Yes, DebriefUnWitnessed, DebriefWitnessed } from '@store/tests/test-summary/test-summary.actions';
import {
  CandidateChoseToProceedWithTestInEnglish,
  CandidateChoseToProceedWithTestInWelsh,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import { Injector } from '@angular/core';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { OutcomeBehaviourMapProviderMock } from '@providers/outcome-behaviour-map/__mocks__/outcome-behaviour-map.mock';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';

describe('PassFinalisationPageComponent', () => {
  let injector: Injector;
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

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Platform,
          useClass: PlatformMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: Router,
          useValue: routerSpy,
        },
        {
          provide: RouteByCategoryProvider,
          useClass: RouteByCategoryProviderMock,
        },
        {
          provide: OutcomeBehaviourMapProvider,
          useClass: OutcomeBehaviourMapProviderMock,
        },
        provideMockStore({ initialState }),
      ],
    });

    injector = TestBed.inject(Injector);
    store$ = TestBed.inject(MockStore);

    spyOn(store$, 'dispatch');

    class BasePageClass extends PassFinalisationPageComponent {
      constructor(inj: Injector) {
        super(inj);
      }
    }

    basePageComponent = new BasePageClass(injector);
  }));

  describe('onInitialisation', () => {
    it('should resolve state variables', () => {
      basePageComponent.onInitialisation();
      basePageComponent.commonPageState.candidateName$.subscribe((res) => expect(res)
        .toEqual('Mr Tim Burr'));
    });
  });

  describe('provisionalLicenseReceived', () => {
    it('should dispatch the correct action when called', () => {
      basePageComponent.provisionalLicenseReceived();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(ProvisionalLicenseReceived());
      expect(store$.dispatch)
        .toHaveBeenCalledTimes(1);
    });
  });

  describe('provisionalLicenseNotReceived', () => {
    it('should dispatch the correct action when called', () => {
      basePageComponent.provisionalLicenseNotReceived();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(ProvisionalLicenseNotReceived());
      expect(store$.dispatch)
        .toHaveBeenCalledTimes(1);
    });
  });

  describe('transmissionChanged', () => {
    it('should dispatch the correct action when called', () => {
      basePageComponent.transmissionChanged('Manual');
      expect(store$.dispatch)
        .toHaveBeenCalledWith(GearboxCategoryChanged('Manual'));
      expect(store$.dispatch)
        .toHaveBeenCalledTimes(1);
    });
  });

  describe('passCertificateNumberChanged', () => {
    it('should dispatch the correct action when called', () => {
      basePageComponent.passCertificateNumberChanged('1e3f5y64');
      expect(store$.dispatch)
        .toHaveBeenCalledWith(PassCertificateNumberChanged('1e3f5y64'));
      expect(store$.dispatch)
        .toHaveBeenCalledTimes(1);
    });
  });

  describe('d255Changed', () => {
    it('should dispatch the correct action if the inputted value is true', () => {
      basePageComponent.d255Changed(true);
      expect(store$.dispatch)
        .toHaveBeenCalledWith(D255Yes());
      expect(store$.dispatch)
        .toHaveBeenCalledTimes(1);
    });
    it('should dispatch the correct action if the inputted value is false', () => {
      basePageComponent.d255Changed(false);
      expect(store$.dispatch)
        .toHaveBeenCalledWith(D255No());
      expect(store$.dispatch)
        .toHaveBeenCalledTimes(1);
    });
  });

  describe('debriefWitnessedChanged', () => {
    it('should dispatch the correct action if the inputted value is true', () => {
      basePageComponent.debriefWitnessedChanged(true);
      expect(store$.dispatch)
        .toHaveBeenCalledWith(DebriefWitnessed());
      expect(store$.dispatch)
        .toHaveBeenCalledTimes(1);
    });
    it('should dispatch the correct action if the inputted value is false', () => {
      basePageComponent.debriefWitnessedChanged(false);
      expect(store$.dispatch)
        .toHaveBeenCalledWith(DebriefUnWitnessed());
      expect(store$.dispatch)
        .toHaveBeenCalledTimes(1);
    });
  });

  describe('isWelshChanged', () => {
    it('should dispatch the correct action if the isWelsh flag is true', () => {
      basePageComponent.isWelshChanged(true);
      expect(store$.dispatch)
        .toHaveBeenCalledWith(CandidateChoseToProceedWithTestInWelsh('Cymraeg'));
      expect(store$.dispatch)
        .toHaveBeenCalledTimes(1);
    });
    it('should dispatch the correct action if the isWelsh flag is false', () => {
      basePageComponent.isWelshChanged(false);
      expect(store$.dispatch)
        .toHaveBeenCalledWith(CandidateChoseToProceedWithTestInEnglish('English'));
      expect(store$.dispatch)
        .toHaveBeenCalledTimes(1);
    });
  });
  describe('onCode78Present', () => {
    [
      {
        outcome: true,
        action: Code78Present,
      },
      {
        outcome: false,
        action: Code78NotPresent,
      },
    ].forEach(({
      action,
      outcome,
    }) => {
      it(`should dispatch Code78${outcome ? 'Present' : 'NotPresent'} with ${outcome}`, () => {
        basePageComponent.onCode78Present(outcome);
        expect(store$.dispatch)
          .toHaveBeenCalledWith(action());
      });
    });
  });
  describe('categoryCodeChanged', () => {
    it('should dispatch PopulateTestCategory with category', () => {
      basePageComponent.categoryCodeChanged('B');
      expect(store$.dispatch)
        .toHaveBeenCalledWith(PopulateTestCategory('B'));
    });
  });
});

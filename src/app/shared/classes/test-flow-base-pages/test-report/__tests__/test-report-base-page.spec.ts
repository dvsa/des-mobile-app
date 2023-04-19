import { TestBed, waitForAsync } from '@angular/core/testing';
import { ModalController, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { PlatformMock, RouterMock } from '@mocks/index.mock';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { StoreModel } from '@shared/models/store.model';
import { TestsModel } from '@store/tests/tests.model';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { Subscription } from 'rxjs';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestReportBasePageComponent } from '../test-report-base-page';

describe('TestReportBasePageComponent', () => {
  let platform: Platform;
  let authenticationProvider: AuthenticationProvider;
  let router: Router;
  let store$: Store<StoreModel>;
  let modalController: ModalController;
  let testReportValidatorProvider: TestReportValidatorProvider;
  let screenOrientation: ScreenOrientation;
  let insomnia: Insomnia;
  let routeByCategory: RouteByCategoryProvider;

  let basePageComponent: TestReportBasePageComponent;
  const initialState = {
    tests: {
      currentTest: { slotId: '1234' },
      startedTests: {
        1234: {
          journalData: {
            candidate: {
              candidateName: { title: 'Mrs', firstName: 'Marge', lastName: 'Simpson' },
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
        { provide: Platform, useClass: PlatformMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: Router, useClass: RouterMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
        provideMockStore({ initialState }),
      ],
    });

    platform = TestBed.inject(Platform);
    authenticationProvider = TestBed.inject(AuthenticationProvider);
    router = TestBed.inject(Router);
    store$ = TestBed.inject(MockStore);
    routeByCategory = TestBed.inject(RouteByCategoryProvider);

    class BasePageClass extends TestReportBasePageComponent {
      constructor(
        plat: Platform,
        auth: AuthenticationProvider,
        rout: Router,
        sto$: Store<StoreModel>,
        modal: ModalController,
        trValidator: TestReportValidatorProvider,
        screenOri: ScreenOrientation,
        insom: Insomnia,
        routeByCat: RouteByCategoryProvider,
      ) {
        // eslint-disable-next-line max-len
        super(plat, auth, rout, sto$, modal, trValidator, screenOri, insom, routeByCat);
      }
    }

    basePageComponent = new BasePageClass(
      platform,
      authenticationProvider,
      router, store$,
      modalController,
      testReportValidatorProvider,
      screenOrientation,
      insomnia,
      routeByCategory,
    );
  }));

  describe('onInitialisation', () => {
    it('should resolve state variables', () => {
      basePageComponent.onInitialisation();
      basePageComponent.commonPageState.candidateUntitledName$
        .subscribe((res) => expect(res).toEqual('Marge Simpson'));
    });
  });

  describe('getTestRequirements', () => {
    it('should return correct value from getTestRequirementsCatB if the category is B', () => {
      expect(basePageComponent.getTestRequirements({
        testRequirements: { normalStart1: true },
      }, TestCategory.B)).toEqual({ normalStart1: true });
    });
    it('should return correct value from getTestRequirementsCatB if the switch defaults', () => {
      expect(basePageComponent.getTestRequirements({
        testRequirements: { normalStart1: true },
      }, TestCategory.EUA1M1)).toEqual({ normalStart1: true });
    });

    [
      TestCategory.C1E,
      TestCategory.C1,
      TestCategory.C,
    ].forEach((value) => {
      it(`should return correct value from getTestRequirementsCatC if category is ${value}`, () => {
        basePageComponent.getTestRequirements({ testRequirements: { angledStart: true } }, value);
        expect(basePageComponent.getTestRequirements({ testRequirements: { angledStart: true } }, value))
          .toEqual({ angledStart: true });
      });
    });
    [
      TestCategory.D1E,
      TestCategory.D1,
      TestCategory.DE,
      TestCategory.D,
    ].forEach((value) => {
      it(`should return correct value from getTestRequirementsCatD if category is ${value}`, () => {
        basePageComponent.getTestRequirements({ testRequirements: { angledStart: true } }, value);
        expect(basePageComponent.getTestRequirements({ testRequirements: { angledStart: true } }, value))
          .toEqual({ angledStart: true });
      });
    });
    [
      TestCategory.F,
      TestCategory.G,
      TestCategory.H,
      TestCategory.K,
    ].forEach((value) => {
      it(`should return correct value from getTestRequirementsCatHome if category is ${value}`, () => {
        basePageComponent.getTestRequirements({ testRequirements: { angledStart: true } }, value);
        expect(basePageComponent.getTestRequirements({ testRequirements: { angledStart: true } }, value))
          .toEqual({ angledStart: true });
      });
    });
  });

  describe('cancelSubscription', () => {
    it('should unsubscribe from the subscription if there is one', () => {
      basePageComponent.subscription = new Subscription();
      spyOn(basePageComponent.subscription, 'unsubscribe');
      basePageComponent.cancelSubscription();
      expect(basePageComponent.subscription.unsubscribe)
        .toHaveBeenCalled();
    });
  });

  describe('toggleReportOverlay', () => {
    it('should toggle displayOverlay', () => {
      basePageComponent.displayOverlay = false;
      basePageComponent.toggleReportOverlay();
      expect(basePageComponent.displayOverlay).toEqual(true);
    });
  });
});

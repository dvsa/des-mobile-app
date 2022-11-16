import {
  waitForAsync,
  TestBed,
} from '@angular/core/testing';
import { ModalController, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { RouterMock, PlatformMock } from '@mocks/index.mock';
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

});

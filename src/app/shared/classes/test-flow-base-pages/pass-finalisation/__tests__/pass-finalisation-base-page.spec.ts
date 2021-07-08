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

import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { StoreModel } from '@shared/models/store.model';
import { TestsModel } from '@store/tests/tests.model';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { PassFinalisationPageComponent }
  from '@shared/classes/test-flow-base-pages/pass-finalisation/pass-finalisation-base-page';

describe('PassFinalisationPageComponent', () => {
  let platform: Platform;
  let authenticationProvider: AuthenticationProvider;
  let router: Router;
  let store$: Store<StoreModel>;

  let basePageComponent: PassFinalisationPageComponent;
  const initialState = {
    tests: {
      currentTest: { slotId: '1234' },
      startedTests: {
        1234: {
          journalData: {
            candidate: {
              candidateName: { title: 'Mr', firstName: 'Tim', lastName: 'Burr' },
            },
          },
        } as TestResultSchemasUnion,
      },
      testStatus: { 1234: TestStatus.Booked },
    } as TestsModel,
  } as StoreModel;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: Router, useClass: RouterMock },
        provideMockStore({ initialState }),
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    platform = TestBed.inject(Platform);
    authenticationProvider = TestBed.inject(AuthenticationProvider);
    router = TestBed.inject(Router);
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
        .subscribe((res) => expect(res).toEqual('Mr Tim Burr'));
    });
  });

});

import {
  async,
  TestBed,
} from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { Store } from '@ngrx/store';
import { PlatformMock } from 'ionic-mocks';
import { Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { StoreModel } from '@shared/models/store.model';
import { TestsModel } from '@store/tests/tests.model';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { WaitingRoomBasePageComponent } from '../waiting-room-base-page';

describe('WaitingRoomBasePageComponent', () => {
  let platform: Platform;
  let authenticationProvider: AuthenticationProvider;
  let router: Router;
  let store$: Store<StoreModel>;

  let basePageComponent: WaitingRoomBasePageComponent;
  const initialState = {
    tests: {
      currentTest: { slotId: '1234' },
      startedTests: {
        1234: {
          preTestDeclarations: { insuranceDeclarationAccepted: false },
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

  beforeEach(async(() => {
    platform = TestBed.inject(Platform);
    authenticationProvider = TestBed.inject(AuthenticationProvider);
    router = TestBed.inject(Router);
    store$ = TestBed.inject(MockStore);

    class BasePageClass extends WaitingRoomBasePageComponent {
      constructor(
        sto$: Store<StoreModel>,
        plat: Platform,
        auth: AuthenticationProvider,
        rout: Router,
      ) {
        super(sto$, plat, auth, rout);
      }
    }
    basePageComponent = new BasePageClass(store$, platform, authenticationProvider, router);
  }));

  describe('ngOnInit', () => {
    it('should resolve state variables', () => {
      basePageComponent.ngOnInit();
      basePageComponent.commonPageState.insuranceDeclarationAccepted$.subscribe((res) => expect(res).toEqual(false));
    });
  });

  describe('ionViewWillEnter', () => {
    it('should set subscription when the merged$ observable is defined', () => {
      basePageComponent.merged$ = of(true);
      expect(basePageComponent.subscription).not.toBeDefined();
      basePageComponent.ionViewWillEnter();
      expect(basePageComponent.subscription).toBeDefined();
    });
  });

  describe('ionViewDidLeave', () => {
    it('should unsubscribe when subscription is defined', () => {
      basePageComponent.subscription = new Subscription();
      spyOn(basePageComponent.subscription, 'unsubscribe');
      basePageComponent.ionViewDidLeave();
      expect(basePageComponent.subscription.unsubscribe).toHaveBeenCalled();
    });
  });

});

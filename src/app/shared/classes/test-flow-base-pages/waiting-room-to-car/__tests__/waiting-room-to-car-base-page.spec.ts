import {
  async,
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
import { PersistTests } from '@store/tests/tests.actions';
import { WaitingRoomToCarBasePageComponent } from '../waiting-room-to-car-base-page';

describe('WaitingRoomToCarBasePageComponent', () => {
  let platform: Platform;
  let authenticationProvider: AuthenticationProvider;
  let router: Router;
  let store$: Store<StoreModel>;

  let basePageComponent: WaitingRoomToCarBasePageComponent;
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

    class BasePageClass extends WaitingRoomToCarBasePageComponent {
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
      basePageComponent.commonPageState.candidateName$
        .subscribe((res) => expect(res).toEqual('Marge Simpson'));
    });
  });

  xdescribe('ionViewDidEnter', () => {
    // @TODO: Enable when WRTC actions have been created;
    it('should dispatch the WaitingRoomToCarViewDidEnter on ion view did enter', () => {
      spyOn(store$, 'dispatch');
      basePageComponent.ionViewDidEnter();
      // expect(store$.dispatch).toHaveBeenCalledWith(WaitingRoomToCarViewDidEnter());
    });
  });

  describe('ionViewWillLeave', () => {
    it('should dispatch the PersistTests action on ion view will leave', () => {
      spyOn(store$, 'dispatch');
      basePageComponent.ionViewWillLeave();
      expect(store$.dispatch).toHaveBeenCalledWith(PersistTests());
    });
  });

});

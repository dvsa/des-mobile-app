import {
  waitForAsync,
  TestBed,
} from '@angular/core/testing';
import { ModalController, Platform } from '@ionic/angular';
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
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
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
      ) {
        // eslint-disable-next-line max-len
        super(plat, auth, rout, sto$, modal, trValidator, screenOri, insom);
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

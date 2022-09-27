import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  IonicModule, Config, NavController, ModalController,
} from '@ionic/angular';
import { Store, StoreModule } from '@ngrx/store';
import { ConfigMock, NavControllerMock } from 'ionic-mocks';
import { AppModule } from '@app/app.module';
import { MockComponent } from 'ng-mocks';
import {
  QuestionOutcome,
  QuestionResult,
} from '@dvsa/mes-test-schema/categories/common';
import { StoreModel } from '@shared/models/store.model';
import {
  TellMeQuestionSelected,
  TellMeQuestionOutcomeChanged,
} from '@store/tests/test-data/cat-adi-part2/vehicle-checks/vehicle-checks.cat-adi-part2.action';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { configureTestSuite } from 'ng-bullet';
import {
  VehicleChecksQuestionComponent,
} from '@pages/waiting-room-to-car/components/vehicle-checks-question/vehicle-checks-question';
import { Subscription } from 'rxjs';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { TestsModel } from '@store/tests/tests.model';
import { provideMockStore } from '@ngrx/store/testing';
import { take } from 'rxjs/operators';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { VehicleChecksCatADIPart2Modal } from '../vehicle-checks-modal.cat-adi-part2.page';
import * as vehicleChecksModalActions from '../vehicle-checks-modal.cat-adi-part2.actions';

describe('VehicleChecksCatADIPart2Modal', () => {
  let fixture: ComponentFixture<VehicleChecksCatADIPart2Modal>;
  let component: VehicleChecksCatADIPart2Modal;
  let store$: Store<StoreModel>;

  const initialState = {
    appInfo: { employeeId: '123456' },
    tests: {
      currentTest: {
        slotId: '123',
      },
      testStatus: {},
      startedTests: {
        123: {
          version: '1',
          rekey: false,
          activityCode: '1',
          category: TestCategory.CE,
          changeMarker: null,
          examinerBooked: null,
          examinerConducted: null,
          examinerKeyed: null,
          journalData: {
            examiner: null,
            testCentre: null,
            testSlotAttributes: null,
            applicationReference: null,
            candidate: {
              candidateName: {
                firstName: 'Firstname',
                lastName: 'Lastname',
              },
            },
          },
          testData: {
            vehicleChecks: {
              fullLicenceHeld: false,
              showMeQuestions: [
                {
                  code: 'Q1',
                  outcome: 'DF',
                  description: 'All doors secure',
                },
              ],
              tellMeQuestions: [
                {
                  code: 'Q3',
                  outcome: 'P',
                  description: 'Safety factors while loading',
                },
              ],
            },
            safetyQuestions: {
              questions: [
                {
                  outcome: 'DF',
                  description: 'Fire Extinguisher',
                },
                {
                  outcome: 'DF',
                  description: 'Emergency exit',
                },
                {
                  outcome: 'P',
                  description: 'Fuel cutoff',
                },
              ],
              faultComments: '',
            },
          },
        } as CatADI2UniqueTypes.TestResult,
      },
    } as TestsModel,
  } as StoreModel;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleChecksCatADIPart2Modal,
        MockComponent(VehicleChecksQuestionComponent),
        WarningBannerComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        {
          provide: Config,
          useFactory: () => ConfigMock.instance(),
        },
        {
          provide: ModalController,
          useClass: ModalControllerMock,
        },
        {
          provide: NavController,
          useFactory: () => NavControllerMock.instance(),
        },
        provideMockStore({ initialState }),
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(VehicleChecksCatADIPart2Modal);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
  }));

  describe('Class', () => {
    it('should compile', () => {
      expect(component)
        .toBeDefined();
    });

    describe('ngOnInit', () => {
      it('should merge the correct data into the subscription', () => {
        component.ngOnInit();
        expect(component.subscription)
          .toBeDefined();
      });
      it('should resolve state variables', () => {
        component.ngOnInit();
        component.pageState.candidateName$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual('Firstname Lastname'));
        component.pageState.tellMeQuestions$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual([
              {
                code: 'Q3',
                outcome: 'P',
                description: 'Safety factors while loading',
              },
            ]));
        component.pageState.vehicleChecksScore$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual({
              seriousFaults: 0,
              drivingFaults: 1,
            }));
      });
    });

    describe('ionViewDidLeave', () => {
      it('should unsubscribe from the subscription if there is one', () => {
        component.subscription = new Subscription();
        spyOn(component.subscription, 'unsubscribe');
        component.ionViewDidLeave();
        expect(component.subscription.unsubscribe)
          .toHaveBeenCalled();
      });
    });

    describe('ionViewDidEnter', () => {
      it('should dispatch the store with VehicleChecksViewDidEnter', () => {
        spyOn(component.store$, 'dispatch');
        component.ionViewDidEnter();
        expect(component.store$.dispatch)
          .toHaveBeenCalledWith(vehicleChecksModalActions.VehicleChecksViewDidEnter());
      });
    });

    describe('onClose', () => {
      it('should dismiss the modal card', async () => {
        spyOn(component.modalCtrl, 'dismiss');
        await component.onClose();
        expect(component.modalCtrl.dismiss)
          .toHaveBeenCalled();
      });
    });

    describe('onSubmit', () => {
      it('should dismiss the modal card', async () => {
        spyOn(component.modalCtrl, 'dismiss');
        await component.onSubmit();
        expect(component.modalCtrl.dismiss)
          .toHaveBeenCalled();
      });
    });

    describe('tellMeQuestionChanged', () => {
      it('should dispatch a new TellMeQuestionSelected action', () => {
        const tellMeQuestionPayload: QuestionResult = {
          code: 'T01',
          description: 'desc',
          outcome: 'DF',
        };
        const index = 1;
        component.tellMeQuestionChanged(tellMeQuestionPayload, index);
        expect(component.store$.dispatch)
          .toHaveBeenCalledWith(TellMeQuestionSelected(tellMeQuestionPayload, index));
      });
    });

    describe('tellMeQuestionOutcomeChanged', () => {
      it('should dispatch a new TellMeQuestionOutcomeChanged action', () => {
        const tellMeQuestionOutcomePayload: QuestionOutcome = 'P';
        const index = 1;
        component.tellMeQuestionOutcomeChanged(tellMeQuestionOutcomePayload, index);
        expect(component.store$.dispatch)
          .toHaveBeenCalledWith(TellMeQuestionOutcomeChanged(tellMeQuestionOutcomePayload, index));
      });
    });
  });
});

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Config, IonicModule, ModalController, NavParams,
} from '@ionic/angular';
import { Store, StoreModule } from '@ngrx/store';
import { ConfigMock, NavParamsMock } from 'ionic-mocks';
import { AppModule } from '@app/app.module';
import { MockComponent } from 'ng-mocks';
import { QuestionOutcome, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { StoreModel } from '@shared/models/store.model';
import { configureTestSuite } from 'ng-bullet';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  SetFullLicenceHeld,
  ShowMeQuestionOutcomeChanged,
  ShowMeQuestionSelected,
  TellMeQuestionSelected,
  TellMeQuestionOutcomeChanged,
} from '@store/tests/test-data/cat-c/vehicle-checks/vehicle-checks.cat-c.action';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import {
  VehicleChecksQuestionComponent,
} from '@pages/waiting-room-to-car/components/vehicle-checks-question/vehicle-checks-question';
import { Subscription } from 'rxjs';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { take } from 'rxjs/operators';
import {
  NUMBER_OF_SHOW_ME_QUESTIONS as NUMBER_OF_SHOW_ME_QUESTIONS_NON_TRAILER,
} from '@shared/constants/show-me-questions/show-me-questions.vocational.constants';
import {
  NUMBER_OF_TELL_ME_QUESTIONS as NUMBER_OF_TELL_ME_QUESTIONS_NON_TRAILER,
} from '@shared/constants/tell-me-questions/tell-me-questions.vocational.constants';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { TestsModel } from '@store/tests/tests.model';
import { provideMockStore } from '@ngrx/store/testing';
import * as vehicleChecksModalActions from '../vehicle-checks-modal.cat-c.actions';
import { VehicleChecksCatCModal } from '../vehicle-checks-modal.cat-c.page';
import { FullLicenceHeldComponent } from '../../../../components/full-licence-held-toggle/full-licence-held-toggle';

describe('VehicleChecksCatCModal', () => {
  let fixture: ComponentFixture<VehicleChecksCatCModal>;
  let component: VehicleChecksCatCModal;
  let store$: Store<StoreModel>;
  let faultCountProvider: FaultCountProvider;

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
        } as CatCUniqueTypes.TestResult,
      },
    } as TestsModel,
  } as StoreModel;

  const bannerDisplayLogicNonTrailer = [
    {
      category: TestCategory.C,
      drivingFaults: 0,
      seriousFaults: 0,
      showBanner: false,
    },
    {
      category: TestCategory.C,
      drivingFaults: 1,
      seriousFaults: 0,
      showBanner: false,
    },
    {
      category: TestCategory.C,
      drivingFaults: 4,
      seriousFaults: 1,
      showBanner: true,
    },
    {
      category: TestCategory.C,
      drivingFaults: 3,
      seriousFaults: 0,
      showBanner: false,
    },
    {
      category: TestCategory.C1,
      drivingFaults: 0,
      seriousFaults: 0,
      showBanner: false,
    },
    {
      category: TestCategory.C1,
      drivingFaults: 1,
      seriousFaults: 0,
      showBanner: false,
    },
    {
      category: TestCategory.C1,
      drivingFaults: 4,
      seriousFaults: 1,
      showBanner: true,
    },
    {
      category: TestCategory.C1,
      drivingFaults: 3,
      seriousFaults: 0,
      showBanner: false,
    },
  ];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleChecksCatCModal,
        MockComponent(FullLicenceHeldComponent),
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
          provide: NavParams,
          useFactory: () => NavParamsMock.instance(),
        },
        provideMockStore({ initialState }),
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(VehicleChecksCatCModal);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    faultCountProvider = TestBed.inject(FaultCountProvider);
    component.category = TestCategory.C;
    spyOn(store$, 'dispatch');
  }));

  describe('showFullLicenceHeld', () => {
    [TestCategory.CE, TestCategory.C1E].forEach((category: TestCategory) => {
      it(`should return false for category ${category} and set fullLicenceHeldSelected to Y`, () => {
        component.category = category;
        expect(component.showFullLicenceHeld())
          .toEqual(true);
      });
    });
    [TestCategory.CE, TestCategory.C1E].forEach((category: TestCategory) => {
      it(`should return true for category ${category}`, () => {
        component.category = category;
        expect(component.showFullLicenceHeld())
          .toEqual(true);
      });
    });
  });

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
        component.pageState.showMeQuestions$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual([
              {
                code: 'Q1',
                outcome: 'DF',
                description: 'All doors secure',
              },
            ]));
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
        component.pageState.vehicleChecks$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual({
              fullLicenceHeld: false,
              showMeQuestions: [
                {
                  code: 'Q1',
                  outcome: 'DF',
                  description: 'All doors secure',
                },
              ],
              tellMeQuestions: [{
                code: 'Q3',
                outcome: 'P',
                description: 'Safety factors while loading',
              },
              ],
            }));
        component.pageState.fullLicenceHeld$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual(false));
        component.pageState.showFullLicenceHeld$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual(true));
        component.pageState.fullLicenceHeldSelection$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual('N'));
      });
    });

    describe('setNumberOfShowMeTellMeQuestions', () => {
      [TestCategory.C, TestCategory.C1].forEach((category) => {
        it('should set showMeQuestionsNumberArray to '
                    + 'an Array of NUMBER_OF_SHOW_ME_QUESTIONS_NON_TRAILER', () => {
          component.category = category;
          component.setNumberOfShowMeTellMeQuestions(true);
          expect(component.showMeQuestionsNumberArray)
            .toEqual(Array(NUMBER_OF_SHOW_ME_QUESTIONS_NON_TRAILER));
        });
        it('should set tellMeQuestionsNumberArray to '
                    + 'an Array of NUMBER_OF_TELL_ME_QUESTIONS_NON_TRAILER', () => {
          component.category = category;
          component.setNumberOfShowMeTellMeQuestions(true);
          expect(component.tellMeQuestionsNumberArray)
            .toEqual(Array(NUMBER_OF_TELL_ME_QUESTIONS_NON_TRAILER));
        });
      });

      [TestCategory.CE, TestCategory.C1E].forEach((category) => {
        it('should set showMeQuestionsNumberArray to '
                    + 'an Array of getNumberOfShowMeQuestions(fullLicenceHeld)', () => {
          component.category = category;
          component.setNumberOfShowMeTellMeQuestions(true);
          spyOn(component, 'getNumberOfShowMeQuestions');
          expect(component.showMeQuestionsNumberArray)
            .toEqual(Array(
              component.getNumberOfShowMeQuestions(component.fullLicenceHeld),
            ));
        });
        it('should set tellMeQuestionsNumberArray to '
                    + 'an Array of getNumberOfTellMeQuestions(fullLicenceHeld)', () => {
          component.category = category;
          component.setNumberOfShowMeTellMeQuestions(true);
          spyOn(component, 'getNumberOfTellMeQuestions');
          expect(component.tellMeQuestionsNumberArray)
            .toEqual(Array(
              component.getNumberOfTellMeQuestions(component.fullLicenceHeld),
            ));
        });
      });
      it('should not change the values of showMeQuestionsNumberArray and '
                + 'tellMeQuestionsNumberArray if the switch statement returns default', () => {
        component.showMeQuestionsNumberArray = [1, 2, 3];
        component.tellMeQuestionsNumberArray = [1, 2, 3];
        component.category = TestCategory.ADI2;
        component.setNumberOfShowMeTellMeQuestions(false);
        expect(component.showMeQuestionsNumberArray)
          .toEqual([1, 2, 3]);
        expect(component.tellMeQuestionsNumberArray)
          .toEqual([1, 2, 3]);
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

    describe('showMeQuestionChanged', () => {
      it('should dispatch a new ShowMeQuestionSelected action', () => {
        const showMeQuestionPayload: QuestionResult = {
          code: '01',
          description: 'desc',
          outcome: 'P',
        };
        const index = 1;
        component.showMeQuestionChanged(showMeQuestionPayload, index);
        expect(component.store$.dispatch)
          .toHaveBeenCalledWith(ShowMeQuestionSelected(showMeQuestionPayload, index));
      });
    });

    describe('showMeQuestionOutcomeChanged', () => {
      it('should dispatch a new ShowMeQuestionOutcomeChanged action', () => {
        const showMeQuestionOutcomePayload: QuestionOutcome = 'P';
        const index = 1;
        component.showMeQuestionOutcomeChanged(showMeQuestionOutcomePayload, index);
        expect(component.store$.dispatch)
          .toHaveBeenCalledWith(ShowMeQuestionOutcomeChanged(showMeQuestionOutcomePayload, index));
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

    describe('shouldDisplayBanner', () => {
      bannerDisplayLogicNonTrailer.forEach((bannerLogic) => {

        it(`Cat ${bannerLogic.category} should return ${bannerLogic.showBanner} if
 there are ${bannerLogic.drivingFaults} driving faults and ${bannerLogic.seriousFaults} serious`, () => {
          component.vehicleChecksScore = {
            drivingFaults: bannerLogic.drivingFaults,
            seriousFaults: bannerLogic.seriousFaults,
          };
          component.category = bannerLogic.category;
          expect(component.shouldDisplayBanner())
            .toBe(bannerLogic.showBanner);
        });
      });
      [TestCategory.CE, TestCategory.C1E].forEach((category) => {
        it('should show when 1 DF and 1 S for full licence', () => {
          component.vehicleChecksScore = {
            drivingFaults: 1,
            seriousFaults: 1,
          };
          component.category = category;
          component.fullLicenceHeld = true;
          expect(component.shouldDisplayBanner())
            .toBe(true);
        });
        it('should hide when 1 DF and 1S for non full licence', () => {
          component.vehicleChecksScore = {
            drivingFaults: 1,
            seriousFaults: 1,
          };
          component.category = category;
          component.fullLicenceHeld = false;
          expect(component.shouldDisplayBanner())
            .toBe(false);
        });
        it('should hide when 4 DF and 0S for non full licence', () => {
          component.vehicleChecksScore = {
            drivingFaults: 4,
            seriousFaults: 0,
          };
          component.category = category;
          component.fullLicenceHeld = false;
          expect(component.shouldDisplayBanner())
            .toBe(false);
        });
      });

      describe('hasFullLicenceHeldBeenSelected', () => {
        it('should return "N" if fullLicenceHeld is false', () => {
          component.fullLicenceHeld = false;
          expect(component.hasFullLicenceHeldBeenSelected(component.fullLicenceHeld))
            .toEqual('N');
        });
        it('should return "Y" if fullLicenceHeld is true', () => {
          component.fullLicenceHeld = true;
          expect(component.hasFullLicenceHeldBeenSelected(component.fullLicenceHeld))
            .toEqual('Y');
        });
        it('should return bull if fullLicenceHeld is null', () => {
          component.fullLicenceHeld = null;
          expect(component.hasFullLicenceHeldBeenSelected(component.fullLicenceHeld))
            .toEqual(null);
        });
      });

      xdescribe('fullLicenceHeldChange', () => {
        it('should convert input to a boolean and pass into setNumberOfShowMeTellMeQuestions', () => {
          spyOn(component, 'setNumberOfShowMeTellMeQuestions');
          spyOn(faultCountProvider, 'getVehicleChecksFaultCount')
            .and
            .returnValue({} as VehicleChecksScore);
          component.category = TestCategory.C1E;
          component.vehicleChecks = {};
          component.fullLicenceHeldChange(true);
          expect(store$.dispatch)
            .toHaveBeenCalledWith(SetFullLicenceHeld(true));
          expect(component.setNumberOfShowMeTellMeQuestions)
            .toHaveBeenCalledWith(true);
          expect(faultCountProvider.getVehicleChecksFaultCount)
            .toHaveBeenCalledWith(TestCategory.C1E, {});
        });
      });
    });
  });
});

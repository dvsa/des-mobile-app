import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  IonicModule, ModalController, NavParams,
} from '@ionic/angular';
import { Store, StoreModule } from '@ngrx/store';
import { NavParamsMock } from '@mocks/index.mock';
import { AppModule } from '@app/app.module';
import { MockComponent } from 'ng-mocks';
import { QuestionOutcome, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { StoreModel } from '@shared/models/store.model';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';

import {
  SetFullLicenceHeld,
  ShowMeQuestionOutcomeChanged,
  ShowMeQuestionSelected,
  TellMeQuestionOutcomeChanged,
  TellMeQuestionSelected,
} from '@store/tests/test-data/cat-d/vehicle-checks/vehicle-checks.cat-d.action';
import {
  SafetyQuestionOutcomeChanged,
} from '@store/tests/test-data/cat-d/safety-questions/safety-questions.cat-d.action';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import {
  VehicleChecksQuestionComponent,
} from '@pages/waiting-room-to-car/components/vehicle-checks-question/vehicle-checks-question';
import { Subscription } from 'rxjs';
import {
  NUMBER_OF_SHOW_ME_QUESTIONS as NUMBER_OF_SHOW_ME_QUESTIONS_NON_TRAILER,
} from '@shared/constants/show-me-questions/show-me-questions.vocational.constants';
import {
  NUMBER_OF_TELL_ME_QUESTIONS as NUMBER_OF_TELL_ME_QUESTIONS_NON_TRAILER,
} from '@shared/constants/tell-me-questions/tell-me-questions.vocational.constants';
import { take } from 'rxjs/operators';
import { provideMockStore } from '@ngrx/store/testing';
import { TestsModel } from '@store/tests/tests.model';
import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { AccessibilityServiceMock } from '@providers/accessibility/__mocks__/accessibility-service.mock';
import { HeaderComponent } from '@components/common/header-component/header.component';
import * as vehicleChecksModalActions from '../vehicle-checks-modal.cat-d.actions';
import { VehicleChecksCatDModal } from '../vehicle-checks-modal.cat-d.page';
import { FullLicenceHeldComponent } from '../../../../components/full-licence-held-toggle/full-licence-held-toggle';
import { SafetyQuestionComponent } from '../../safety-question/safety-question';

describe('VehicleChecksCatDModal', () => {
  let fixture: ComponentFixture<VehicleChecksCatDModal>;
  let component: VehicleChecksCatDModal;
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
          journalData: {
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
        } as CatDUniqueTypes.TestResult,
      },
    } as TestsModel,
  } as StoreModel;

  const bannerDisplayLogicNonTrailer = [
    {
      category: TestCategory.D,
      drivingFaults: 0,
      seriousFaults: 0,
      showBanner: false,
    },
    {
      category: TestCategory.D,
      drivingFaults: 1,
      seriousFaults: 0,
      showBanner: false,
    },
    {
      category: TestCategory.D,
      drivingFaults: 4,
      seriousFaults: 1,
      showBanner: true,
    },
    {
      category: TestCategory.D,
      drivingFaults: 3,
      seriousFaults: 0,
      showBanner: false,
    },
    {
      category: TestCategory.D1,
      drivingFaults: 0,
      seriousFaults: 0,
      showBanner: false,
    },
    {
      category: TestCategory.D1,
      drivingFaults: 1,
      seriousFaults: 0,
      showBanner: false,
    },
    {
      category: TestCategory.D1,
      drivingFaults: 4,
      seriousFaults: 1,
      showBanner: true,
    },
    {
      category: TestCategory.D1,
      drivingFaults: 3,
      seriousFaults: 0,
      showBanner: false,
    },
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleChecksCatDModal,
        MockComponent(FullLicenceHeldComponent),
        MockComponent(VehicleChecksQuestionComponent),
        MockComponent(SafetyQuestionComponent),
        MockComponent(WarningBannerComponent),
        MockComponent(HeaderComponent),
      ],
      imports: [
        IonicModule,
        AppModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        {
          provide: ModalController,
          useClass: ModalControllerMock,
        },
        {
          provide: ModalController,
          useClass: ModalControllerMock,
        },
        {
          provide: AccessibilityService,
          useClass: AccessibilityServiceMock,
        },
        {
          provide: NavParams,
          useClass: NavParamsMock,
        },
        provideMockStore({ initialState }),
      ],
    });

    fixture = TestBed.createComponent(VehicleChecksCatDModal);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    faultCountProvider = TestBed.inject(FaultCountProvider);
    spyOn(store$, 'dispatch');
    component.category = TestCategory.D;
  }));

  describe('Class', () => {
    it('should compile', () => {
      expect(component)
        .toBeDefined();
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

    describe('ionViewDidLeave', () => {
      it('should unsubscribe from the subscription if there is one', () => {
        component.subscription = new Subscription();
        spyOn(component.subscription, 'unsubscribe');
        component.ionViewDidLeave();
        expect(component.subscription.unsubscribe)
          .toHaveBeenCalled();
      });
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
        component.pageState.safetyQuestions$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual([
              {
                outcome: 'DF',
                description: 'Emergency exit',
              },
              {
                outcome: 'P',
                description: 'Fuel cutoff',
              },
            ]));
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
              tellMeQuestions: [
                {
                  code: 'Q3',
                  outcome: 'P',
                  description: 'Safety factors while loading',
                },
              ],
            }));
        component.pageState.vehicleChecksScore$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual({
              seriousFaults: 0,
              drivingFaults: 1,
            }));
        component.pageState.safetyQuestionsScore$
          .pipe(take(1))
          .subscribe((res) => expect(res)
            .toEqual({ drivingFaults: 1 }));
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

    describe('setNumberOfShowMeTellMeQuestions', () => {
      [TestCategory.D, TestCategory.D1].forEach((category) => {
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

      [TestCategory.DE, TestCategory.D1E].forEach((category) => {
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

    describe('safetyQuestionOutcomeChanged', () => {
      it('should dispatch a new SafetyQuestionOutcomeChanged action', () => {
        const safetyQuestionOutcomePayload: QuestionOutcome = 'P';
        const index = 1;
        component.safetyQuestionOutcomeChanged(safetyQuestionOutcomePayload, index);
        expect(component.store$.dispatch)
          .toHaveBeenCalledWith(SafetyQuestionOutcomeChanged(safetyQuestionOutcomePayload, index));
      });
    });

    describe('shouldDisplayBanner', () => {
      bannerDisplayLogicNonTrailer.forEach((bannerLogic) => {
        it(`Cat ${bannerLogic.category} should return ${bannerLogic.showBanner} if there are
 ${bannerLogic.drivingFaults} driving faults and ${bannerLogic.seriousFaults} serious`, () => {
          component.vehicleChecksScore = {
            drivingFaults: bannerLogic.drivingFaults,
            seriousFaults: bannerLogic.seriousFaults,
          };
          component.fullLicenceHeldSelected = 'Y';
          component.category = bannerLogic.category;
          expect(component.shouldDisplayBanner())
            .toBe(bannerLogic.showBanner);
        });
      });

      [TestCategory.DE, TestCategory.D1E].forEach((category) => {
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
    });

    describe('fullLicenceHeldChange', () => {
      it('should convert input to a boolean and pass into setNumberOfShowMeTellMeQuestions', () => {
        spyOn(component, 'setNumberOfShowMeTellMeQuestions');
        spyOn(faultCountProvider, 'getVehicleChecksFaultCount')
          .and
          .returnValue({} as VehicleChecksScore);
        component.category = TestCategory.D1E;
        component.vehicleChecks = {};
        component.fullLicenceHeldChange(true);
        expect(store$.dispatch)
          .toHaveBeenCalledWith(SetFullLicenceHeld(true));
        expect(component.setNumberOfShowMeTellMeQuestions)
          .toHaveBeenCalledWith(true);
        expect(faultCountProvider.getVehicleChecksFaultCount)
          .toHaveBeenCalledWith(TestCategory.D1E, {});
      });
    });

    describe('showFullLicenceHeld', () => {
      [TestCategory.D, TestCategory.D1].forEach((category: TestCategory) => {
        it(`should return false for category ${category} and set fullLicenceHeldSelected to Y`, () => {
          component.category = category;
          expect(component.showFullLicenceHeld())
            .toEqual(false);
        });
      });
      [TestCategory.DE, TestCategory.D1E].forEach((category: TestCategory) => {
        it(`should return true for category ${category}`, () => {
          component.category = category;
          expect(component.showFullLicenceHeld())
            .toEqual(true);
        });
      });
    });
  });
});

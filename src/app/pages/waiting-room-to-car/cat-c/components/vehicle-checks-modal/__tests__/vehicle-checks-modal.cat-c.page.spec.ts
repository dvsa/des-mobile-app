import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { QuestionOutcome, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { VehicleChecksQuestionComponent } from '@pages/waiting-room-to-car/components/vehicle-checks-question/vehicle-checks-question';
import { NUMBER_OF_SHOW_ME_QUESTIONS as NUMBER_OF_SHOW_ME_QUESTIONS_NON_TRAILER } from '@shared/constants/show-me-questions/show-me-questions.vocational.constants';
import { NUMBER_OF_TELL_ME_QUESTIONS as NUMBER_OF_TELL_ME_QUESTIONS_NON_TRAILER } from '@shared/constants/tell-me-questions/tell-me-questions.vocational.constants';
import { StoreModel } from '@shared/models/store.model';
import {
  SetFullLicenceHeld,
  ShowMeQuestionOutcomeChanged,
  ShowMeQuestionSelected,
  TellMeQuestionOutcomeChanged,
  TellMeQuestionSelected,
} from '@store/tests/test-data/cat-c/vehicle-checks/vehicle-checks.cat-c.action';
import { TestsModel } from '@store/tests/tests.model';
import { MockComponent } from 'ng-mocks';
import { FullLicenceHeldComponent } from '../../../../components/full-licence-held-toggle/full-licence-held-toggle';
import * as vehicleChecksModalActions from '../vehicle-checks-modal.cat-c.actions';
import { VehicleChecksCatCModal } from '../vehicle-checks-modal.cat-c.page';

describe('VehicleChecksCatCModal', () => {
  let fixture: ComponentFixture<VehicleChecksCatCModal>;
  let component: VehicleChecksCatCModal;
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        VehicleChecksCatCModal,
        MockComponent(FullLicenceHeldComponent),
        MockComponent(VehicleChecksQuestionComponent),
        MockComponent(WarningBannerComponent),
      ],
      providers: [
        {
          provide: ModalController,
          useClass: ModalControllerMock,
        },
        provideMockStore({ initialState }),
      ],
    });

    fixture = TestBed.createComponent(VehicleChecksCatCModal);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    component.category = TestCategory.C;
    vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
  });

  describe('showFullLicenceHeld', () => {
    [TestCategory.CE, TestCategory.C1E].forEach((category: TestCategory) => {
      it(`should return false for category ${category} and set fullLicenceHeldSelected to Y`, () => {
        component.category = category;
        expect(component.showFullLicenceHeld()).toEqual(true);
      });
    });
    [TestCategory.CE, TestCategory.C1E].forEach((category: TestCategory) => {
      it(`should return true for category ${category}`, () => {
        component.category = category;
        expect(component.showFullLicenceHeld()).toEqual(true);
      });
    });
  });

  describe('Class', () => {
    it('should compile', () => {
      expect(component).toBeDefined();
    });

    describe('signal state', () => {
      it('resolves state variables', () => {
        component.ngOnInit();
        expect(component.candidateName()).toEqual('Firstname Lastname');
        expect(component.selectedShowMeQuestions()).toEqual([
          { code: 'Q1', outcome: 'DF', description: 'All doors secure' },
        ]);
        expect(component.selectedTellMeQuestions()).toEqual([
          { code: 'Q3', outcome: 'P', description: 'Safety factors while loading' },
        ]);
        expect(component.vehicleChecksScore).toEqual({ seriousFaults: 0, drivingFaults: 1 });
        expect(component.fullLicenceHeld).toBe(false);
        expect(component.showFullLicenceHeldInStore()).toBe(true);
        expect(component.fullLicenceHeldSelection()).toBe('N');
      });
    });

    it('updates licence and checks score when the store changes', () => {
      component.category = TestCategory.C1E;
      expect(component.fullLicenceHeld).toBe(false);
      expect(component.vehicleChecksScore.drivingFaults).toBe(1);
      const updated = structuredClone(initialState);
      const test = updated.tests.startedTests[123] as CatCUniqueTypes.TestResult;
      test.testData.vehicleChecks.fullLicenceHeld = true;
      test.testData.vehicleChecks.showMeQuestions[0].outcome = 'P';
      TestBed.inject(MockStore).setState(updated);
      expect(component.fullLicenceHeld).toBe(true);
      expect(component.fullLicenceHeldSelection()).toBe('Y');
      expect(component.vehicleChecksScore.drivingFaults).toBe(0);
    });

    describe('setNumberOfShowMeTellMeQuestions', () => {
      [TestCategory.C, TestCategory.C1].forEach((category) => {
        it('should set showMeQuestionsNumberArray to ' + 'an Array of NUMBER_OF_SHOW_ME_QUESTIONS_NON_TRAILER', () => {
          component.category = category;
          component.setNumberOfShowMeTellMeQuestions(true);
          expect(component.showMeQuestionsNumberArray).toEqual(Array(NUMBER_OF_SHOW_ME_QUESTIONS_NON_TRAILER));
        });
        it('should set tellMeQuestionsNumberArray to ' + 'an Array of NUMBER_OF_TELL_ME_QUESTIONS_NON_TRAILER', () => {
          component.category = category;
          component.setNumberOfShowMeTellMeQuestions(true);
          expect(component.tellMeQuestionsNumberArray).toEqual(Array(NUMBER_OF_TELL_ME_QUESTIONS_NON_TRAILER));
        });
      });

      [TestCategory.CE, TestCategory.C1E].forEach((category) => {
        it(
          'should set showMeQuestionsNumberArray to ' + 'an Array of getNumberOfShowMeQuestions(fullLicenceHeld)',
          () => {
            component.category = category;
            component.setNumberOfShowMeTellMeQuestions(true);
            vi.spyOn(component, 'getNumberOfShowMeQuestions').mockReturnValue(undefined);
            expect(component.showMeQuestionsNumberArray).toEqual(
              Array(component.getNumberOfShowMeQuestions(component.fullLicenceHeld))
            );
          }
        );
        it(
          'should set tellMeQuestionsNumberArray to ' + 'an Array of getNumberOfTellMeQuestions(fullLicenceHeld)',
          () => {
            component.category = category;
            component.setNumberOfShowMeTellMeQuestions(true);
            vi.spyOn(component, 'getNumberOfTellMeQuestions').mockReturnValue(undefined);
            expect(component.tellMeQuestionsNumberArray).toEqual(
              Array(component.getNumberOfTellMeQuestions(component.fullLicenceHeld))
            );
          }
        );
      });
      it(
        'should not change the values of showMeQuestionsNumberArray and ' +
          'tellMeQuestionsNumberArray if the switch statement returns default',
        () => {
          component.showMeQuestionsNumberArray = [1, 2, 3];
          component.tellMeQuestionsNumberArray = [1, 2, 3];
          component.category = TestCategory.ADI2;
          component.setNumberOfShowMeTellMeQuestions(false);
          expect(component.showMeQuestionsNumberArray).toEqual([1, 2, 3]);
          expect(component.tellMeQuestionsNumberArray).toEqual([1, 2, 3]);
        }
      );
    });

    describe('ionViewDidEnter', () => {
      it('should dispatch the store with VehicleChecksViewDidEnter', () => {
        vi.spyOn(component.store$, 'dispatch').mockReturnValue(undefined);
        component.ionViewDidEnter();
        expect(component.store$.dispatch).toHaveBeenCalledWith(vehicleChecksModalActions.VehicleChecksViewDidEnter());
      });
    });

    describe('onClose', () => {
      it('should dismiss the modal card', async () => {
        vi.spyOn(component.modalCtrl, 'dismiss').mockReturnValue(undefined);
        await component.onClose();
        expect(component.modalCtrl.dismiss).toHaveBeenCalled();
      });
    });

    describe('onSubmit', () => {
      it('should dismiss the modal card', async () => {
        vi.spyOn(component.modalCtrl, 'dismiss').mockReturnValue(undefined);
        await component.onSubmit();
        expect(component.modalCtrl.dismiss).toHaveBeenCalled();
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
        expect(component.store$.dispatch).toHaveBeenCalledWith(ShowMeQuestionSelected(showMeQuestionPayload, index));
      });
    });

    describe('showMeQuestionOutcomeChanged', () => {
      it('should dispatch a new ShowMeQuestionOutcomeChanged action', () => {
        const showMeQuestionOutcomePayload: QuestionOutcome = 'P';
        const index = 1;
        component.showMeQuestionOutcomeChanged(showMeQuestionOutcomePayload, index);
        expect(component.store$.dispatch).toHaveBeenCalledWith(
          ShowMeQuestionOutcomeChanged(showMeQuestionOutcomePayload, index)
        );
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
        expect(component.store$.dispatch).toHaveBeenCalledWith(TellMeQuestionSelected(tellMeQuestionPayload, index));
      });
    });

    describe('tellMeQuestionOutcomeChanged', () => {
      it('should dispatch a new TellMeQuestionOutcomeChanged action', () => {
        const tellMeQuestionOutcomePayload: QuestionOutcome = 'P';
        const index = 1;
        component.tellMeQuestionOutcomeChanged(tellMeQuestionOutcomePayload, index);
        expect(component.store$.dispatch).toHaveBeenCalledWith(
          TellMeQuestionOutcomeChanged(tellMeQuestionOutcomePayload, index)
        );
      });
    });

    describe('shouldDisplayBanner', () => {
      bannerDisplayLogicNonTrailer.forEach((bannerLogic) => {
        it(`Cat ${bannerLogic.category} should return ${bannerLogic.showBanner} if
 there are ${bannerLogic.drivingFaults} driving faults and ${bannerLogic.seriousFaults} serious`, () => {
          vi.spyOn(component, 'vehicleChecksScore', 'get').mockReturnValue({
            drivingFaults: bannerLogic.drivingFaults,
            seriousFaults: bannerLogic.seriousFaults,
          });
          component.category = bannerLogic.category;
          expect(component.shouldDisplayBanner()).toBe(bannerLogic.showBanner);
        });
      });
      [TestCategory.CE, TestCategory.C1E].forEach((category) => {
        it('should show when 1 DF and 1 S for full licence', () => {
          vi.spyOn(component, 'vehicleChecksScore', 'get').mockReturnValue({
            drivingFaults: 1,
            seriousFaults: 1,
          });
          component.category = category;
          vi.spyOn(component, 'fullLicenceHeld', 'get').mockReturnValue(true);
          expect(component.shouldDisplayBanner()).toBe(true);
        });
        it('should hide when 1 DF and 1S for non full licence', () => {
          vi.spyOn(component, 'vehicleChecksScore', 'get').mockReturnValue({
            drivingFaults: 1,
            seriousFaults: 1,
          });
          component.category = category;
          vi.spyOn(component, 'fullLicenceHeld', 'get').mockReturnValue(false);
          expect(component.shouldDisplayBanner()).toBe(false);
        });
        it('should hide when 4 DF and 0S for non full licence', () => {
          vi.spyOn(component, 'vehicleChecksScore', 'get').mockReturnValue({
            drivingFaults: 4,
            seriousFaults: 0,
          });
          component.category = category;
          vi.spyOn(component, 'fullLicenceHeld', 'get').mockReturnValue(false);
          expect(component.shouldDisplayBanner()).toBe(false);
        });
      });

      describe('hasFullLicenceHeldBeenSelected', () => {
        it('should return "N" if fullLicenceHeld is false', () => {
          vi.spyOn(component, 'fullLicenceHeld', 'get').mockReturnValue(false);
          expect(component.hasFullLicenceHeldBeenSelected(component.fullLicenceHeld)).toEqual('N');
        });
        it('should return "Y" if fullLicenceHeld is true', () => {
          vi.spyOn(component, 'fullLicenceHeld', 'get').mockReturnValue(true);
          expect(component.hasFullLicenceHeldBeenSelected(component.fullLicenceHeld)).toEqual('Y');
        });
        it('should return bull if fullLicenceHeld is null', () => {
          vi.spyOn(component, 'fullLicenceHeld', 'get').mockReturnValue(null);
          expect(component.hasFullLicenceHeldBeenSelected(component.fullLicenceHeld)).toEqual(null);
        });
      });

      describe('fullLicenceHeldChange', () => {
        it('should convert input to a boolean and pass into setNumberOfShowMeTellMeQuestions', () => {
          vi.spyOn(component, 'setNumberOfShowMeTellMeQuestions').mockReturnValue(undefined);
          component.category = TestCategory.C1E;
          component.fullLicenceHeldChange(true);
          expect(store$.dispatch).toHaveBeenCalledWith(SetFullLicenceHeld(true));
          expect(component.setNumberOfShowMeTellMeQuestions).toHaveBeenCalledWith(true);
        });
      });
    });
  });
});

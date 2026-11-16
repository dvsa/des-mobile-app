import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { Style } from '@capacitor/status-bar';
import { CatFUniqueTypes } from '@dvsa/mes-test-schema/categories/F';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { VehicleChecksCatHomeTestModal } from '@pages/waiting-room-to-car/cat-home-test/components/vehicle-checks-modal/vehicle-checks-modal.cat-home.page';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MotCardComponent } from '@pages/waiting-room-to-car/components/mot-components/mot-card/mot-card.component';
import { MotNoEvidenceConfirmationComponent } from '@pages/waiting-room-to-car/components/mot-components/mot-no-evidence-confirmation/mot-no-evidence-confirmation';
import { PracticeModeMOTModal } from '@pages/waiting-room-to-car/components/mot-components/practice-mode-mot-modal/practice-mode-mot-modal.component';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { QuestionProviderMock } from '@providers/question/__mocks__/question.mock';
import { QuestionProvider } from '@providers/question/question';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { StoreModel } from '@shared/models/store.model';
import {
  ShowMeQuestionOutcomeChanged,
  ShowMeQuestionSelected,
  TellMeQuestionOutcomeChanged,
  TellMeQuestionSelected,
} from '@store/tests/test-data/cat-home/vehicle-checks/vehicle-checks.cat-home.actions';
import { TestsModel } from '@store/tests/tests.model';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AccompanimentCardComponent } from '../../../../components/accompaniment-card/accompaniment-card';
import { AccompanimentComponent } from '../../../../components/accompaniment/accompaniment';
import { CandidateDeclarationSignedComponent } from '../../../../components/candidate-declaration/candidate-declaration';
import { EyesightFailureConfirmationComponent } from '../../../../components/eyesight-failure-confirmation/eyesight-failure-confirmation';
import { EyesightTestComponent } from '../../../../components/eyesight-test/eyesight-test';
import { FullLicenceHeldComponent } from '../../../../components/full-licence-held-toggle/full-licence-held-toggle';
import { AlternateMotEvidenceComponent } from '../../../../components/mot-components/alternate-mot-evidence/alternate-mot-evidence.component';
import { MotFailedModal } from '../../../../components/mot-components/mot-failed-modal/mot-failed-modal.component';
import { TestCategoryComponent } from '../../../../components/test-category/test-category';
import { VehicleChecksToggleComponent } from '../../../../components/vehicle-checks-completed/vehicle-checks-completed';
import { VehicleChecksQuestionComponent } from '../../../../components/vehicle-checks-question/vehicle-checks-question';
import { VehicleChecksComponent } from '../../../../components/vehicle-checks/vehicle-checks';
import { VehicleDetailsCardComponent } from '../../../../components/vehicle-details-card/vehicle-details-card';
import { VehicleDetailsComponent } from '../../../../components/vehicle-details/vehicle-details';
import { VehicleRegistrationComponent } from '../../../../components/vehicle-registration/vehicle-registration';

describe('VehicleChecksCatHomeTestModal', () => {
  let component: VehicleChecksCatHomeTestModal;
  let fixture: ComponentFixture<VehicleChecksCatHomeTestModal>;

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
          },
        } as CatFUniqueTypes.TestResult,
      },
    } as TestsModel,
  } as StoreModel;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        EyesightTestComponent,
        EyesightFailureConfirmationComponent,
        VehicleRegistrationComponent,
        AccompanimentCardComponent,
        AccompanimentComponent,
        VehicleDetailsCardComponent,
        VehicleDetailsComponent,
        VehicleChecksToggleComponent,
        CandidateDeclarationSignedComponent,
        FullLicenceHeldComponent,
        TestCategoryComponent,
        VehicleChecksComponent,
        VehicleChecksQuestionComponent,
        MotCardComponent,
        MotFailedModal,
        PracticeModeMOTModal,
        AlternateMotEvidenceComponent,
        MotNoEvidenceConfirmationComponent,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        StoreModule,
        VehicleChecksCatHomeTestModal,
      ],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
        {
          provide: RouteByCategoryProvider,
          useClass: RouteByCategoryProviderMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: DateTimeProvider,
          useClass: DateTimeProviderMock,
        },
        {
          provide: QuestionProvider,
          useClass: QuestionProviderMock,
        },
        {
          provide: FaultCountProvider,
          useClass: FaultCountProvider,
        },
        provideMockStore({ initialState }),
      ],
    });

    fixture = TestBed.createComponent(VehicleChecksCatHomeTestModal);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.category = TestCategory.F;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Class', () => {
    describe('onClose', () => {
      it('should dismiss the modal when the function is run & set the status bar to Light styling if practice mode is true', async () => {
        vi.spyOn(component.modalCtrl, 'dismiss').mockReturnValue(undefined);
        vi.spyOn(component.accessibilityService, 'configureStatusBar').mockReturnValue(undefined);
        component.isPracticeMode = true;
        await component.onClose().then(() => {
          expect(component.accessibilityService.configureStatusBar).toHaveBeenCalledWith(Style.Light);
          expect(component.modalCtrl.dismiss).toHaveBeenCalled();
        });
      });
    });

    describe('ngOnInit', () => {
      afterEach(() => {
        // clean up subs
        component.subscription.unsubscribe();
      });
      it('should merge the correct data into the subscription', () => {
        component.ngOnInit();
        expect(component.subscription).toBeDefined();
      });
      it('should resolve state variables', () => {
        component.ngOnInit();
        component.pageState.candidateName$.pipe(take(1)).subscribe((res) => expect(res).toEqual('Firstname Lastname'));
        component.pageState.showMeQuestions$.pipe(take(1)).subscribe((res) =>
          expect(res).toEqual([
            {
              code: 'Q1',
              outcome: 'DF',
              description: 'All doors secure',
            },
          ])
        );
        component.pageState.tellMeQuestions$.pipe(take(1)).subscribe((res) =>
          expect(res).toEqual([
            {
              code: 'Q3',
              outcome: 'P',
              description: 'Safety factors while loading',
            },
          ])
        );
        component.pageState.vehicleChecksScore$.pipe(take(1)).subscribe((res) =>
          expect(res).toEqual({
            seriousFaults: 0,
            drivingFaults: 1,
          })
        );
      });
    });

    describe('onSubmit', () => {
      it('should dismiss the modal when the function is run & set the status bar to Light styling if practice mode is true', async () => {
        vi.spyOn(component.accessibilityService, 'configureStatusBar').mockReturnValue(undefined);
        vi.spyOn(component.modalCtrl, 'dismiss').mockReturnValue(undefined);
        component.isPracticeMode = true;
        await component.onSubmit().then(() => {
          expect(component.accessibilityService.configureStatusBar).toHaveBeenCalledWith(Style.Light);
          expect(component.modalCtrl.dismiss).toHaveBeenCalled();
        });
      });
    });
    describe('showMeQuestionChanged', () => {
      it('should ', () => {
        vi.spyOn(component.store$, 'dispatch').mockReturnValue(undefined);
        component.showMeQuestionChanged(null, 0);
        expect(component.store$.dispatch).toHaveBeenCalledWith(ShowMeQuestionSelected(null, 0));
      });
    });
    describe('showMeQuestionOutcomeChanged', () => {
      it('should dispatch', () => {
        vi.spyOn(component.store$, 'dispatch').mockReturnValue(undefined);
        component.showMeQuestionOutcomeChanged(null, 0);
        expect(component.store$.dispatch).toHaveBeenCalledWith(ShowMeQuestionOutcomeChanged(null, 0));
      });
    });
    describe('ionViewDidEnter', () => {
      it('should dispatch', () => {
        vi.spyOn(component.store$, 'dispatch').mockReturnValue(undefined);
        component.ionViewDidEnter();
        expect(component.store$.dispatch).toHaveBeenCalled();
      });
    });
    describe('tellMeQuestionChanged', () => {
      it('should dispatch', () => {
        vi.spyOn(component.store$, 'dispatch').mockReturnValue(undefined);
        component.tellMeQuestionChanged(null, 0);
        expect(component.store$.dispatch).toHaveBeenCalledWith(TellMeQuestionSelected(null, 0));
      });
    });
    describe('tellMeQuestionOutcomeChanged', () => {
      it('should dispatch', () => {
        vi.spyOn(component.store$, 'dispatch').mockReturnValue(undefined);
        component.tellMeQuestionOutcomeChanged(null, 0);
        expect(component.store$.dispatch).toHaveBeenCalledWith(TellMeQuestionOutcomeChanged(null, 0));
      });
    });
    describe('ionViewDidLeave', () => {
      it('should unsubscribe from the subscription if there is one', () => {
        component.subscription = new Subscription();
        vi.spyOn(component.subscription, 'unsubscribe').mockReturnValue(undefined);
        component.ionViewDidLeave();
        expect(component.subscription.unsubscribe).toHaveBeenCalled();
      });
    });
  });
});

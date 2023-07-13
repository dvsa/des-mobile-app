import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { StoreModule, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { MockComponent } from 'ng-mocks';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import {
  DrivingFaultsBadgeComponent,
} from '@components/common/driving-faults-badge/driving-faults-badge';
import {
  SeriousFaultBadgeComponent,
} from '@components/common/serious-fault-badge/serious-fault-badge';
import {
  DangerousFaultBadgeComponent,
} from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { StartTest } from '@store/tests/tests.actions';

import {
  ShowMeQuestionAddDrivingFault,
  ShowMeQuestionRemoveDrivingFault,
  VehicleChecksAddSeriousFault,
  VehicleChecksAddDangerousFault,
  VehicleChecksRemoveSeriousFault,
  VehicleChecksRemoveDangerousFault, VehicleChecksCompletedToggle,
} from '@store/tests/test-data/cat-adi-part2/vehicle-checks/vehicle-checks.cat-adi-part2.action';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { ShowMeQuestionRemoveFault } from '@store/tests/test-data/cat-b/vehicle-checks/vehicle-checks.actions';
import {
  ToggleDangerousFaultMode,
  ToggleRemoveFaultMode,
  ToggleSeriousFaultMode,
} from '@pages/test-report/test-report.actions';
import { CompetencyButtonComponent } from '../../../../components/competency-button/competency-button';
import { testReportReducer } from '../../../../test-report.reducer';
import { VehicleCheckComponent } from '../vehicle-check';

describe('VehicleCheckComponent', () => {
  let fixture: ComponentFixture<VehicleCheckComponent>;
  let component: VehicleCheckComponent;
  let store$: Store<StoreModel>;

  const mockTestData = {
    dangerousFaults: {},
    drivingFaults: {},
    manoeuvres: [{ reverseRight: { selected: true } }, {}],
    seriousFaults: {},
    testRequirements: {},
    ETA: {},
    eco: {},
    vehicleChecks: {
      showMeQuestion: [
        {
          code: 'S3',
          description: '',
          outcome: 'P',
        },
      ],
      tellMeQuestion: [
        {
          code: 'T4',
          description: '',
          outcome: 'P',
        },
      ],
    },
    eyesightTest: {},
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleCheckComponent,
        MockComponent(TickIndicatorComponent),
        MockComponent(DrivingFaultsBadgeComponent),
        MockComponent(SeriousFaultBadgeComponent),
        MockComponent(DangerousFaultBadgeComponent),
        MockComponent(CompetencyButtonComponent),
      ],
      imports: [
        IonicModule,
        StoreModule.forRoot({
          tests: () => ({
            currentTest: {
              slotId: '123',
            },
            testStatus: {},
            startedTests: {
              123: {
                testData: mockTestData,
                postTestDeclarations: {
                  healthDeclarationAccepted: false,
                  passCertificateNumberReceived: false,
                  postTestSignature: '',
                },
                journalData: {},
                category: 'ADI2',
                communicationPreferences: {
                  updatedEmail: '',
                  communicationMethod: 'Not provided',
                  conductedLanguage: 'Not provided',
                },
              },
            },
          }),
          testReport: testReportReducer,
        }),
      ],
      providers: [
        FaultCountProvider,
      ],
    });

    fixture = TestBed.createComponent(VehicleCheckComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    store$.dispatch(StartTest(105, TestCategory.ADI2));
    spyOn(store$, 'dispatch');
  }));

  describe('Class', () => {

    describe('canButtonRipple', () => {
      it('should return true if hasDangerousFault and isDangerousMode are true '
        + 'and isRemoveFaultMode is true', () => {
        component.isRemoveFaultMode = true;
        spyOn(component, 'hasDangerousFault').and.returnValue(true);
        component.isDangerousMode = true;
        expect(component.canButtonRipple()).toEqual(true);
      });
      it('should return true if hasSeriousFault and isSeriousMode are true '
        + 'and isRemoveFaultMode is true', () => {
        component.isRemoveFaultMode = true;
        spyOn(component, 'hasDangerousFault').and.returnValue(false);
        spyOn(component, 'hasSeriousFault').and.returnValue(true);
        component.isSeriousMode = true;
        expect(component.canButtonRipple()).toEqual(true);
      });
      it('should return true if hasShowMeDrivingFault is true, '
        + 'isSeriousMode and isDangerousMode are false and isRemoveFaultMode is true', () => {
        component.isRemoveFaultMode = true;
        spyOn(component, 'hasDangerousFault').and.returnValue(false);
        spyOn(component, 'hasSeriousFault').and.returnValue(false);
        spyOn(component, 'hasShowMeDrivingFault').and.returnValue(true);
        component.isDangerousMode = false;
        component.isSeriousMode = false;
        expect(component.canButtonRipple()).toEqual(true);
      });
      it('should return false if no other condition is met '
        + 'and isRemoveFaultMode is true', () => {
        component.isRemoveFaultMode = true;
        spyOn(component, 'hasDangerousFault').and.returnValue(false);
        spyOn(component, 'hasSeriousFault').and.returnValue(false);
        spyOn(component, 'hasShowMeDrivingFault').and.returnValue(false);
        component.isDangerousMode = false;
        component.isSeriousMode = false;
        expect(component.canButtonRipple()).toEqual(false);
      });
      it('should return false if isRemoveFaultMode is false '
        + 'and hasDangerousFault, hasSeriousFault and hasShowMeDrivingFault are true', () => {
        component.isRemoveFaultMode = false;
        spyOn(component, 'hasDangerousFault').and.returnValue(true);
        spyOn(component, 'hasSeriousFault').and.returnValue(true);
        spyOn(component, 'hasShowMeDrivingFault').and.returnValue(true);
        expect(component.canButtonRipple()).toEqual(false);
      });
      it('should return true if isRemoveFaultMode is false '
        + 'and hasDangerousFault, hasSeriousFault and hasShowMeDrivingFault are false', () => {
        component.isRemoveFaultMode = false;
        spyOn(component, 'hasDangerousFault').and.returnValue(false);
        spyOn(component, 'hasSeriousFault').and.returnValue(false);
        spyOn(component, 'hasShowMeDrivingFault').and.returnValue(false);
        expect(component.canButtonRipple()).toEqual(true);
      });
    });
    describe('onTap', () => {
      it('should run addOrRemoveFault', () => {
        spyOn(component, 'addOrRemoveFault');
        component.onTap();
        expect(component.addOrRemoveFault).toHaveBeenCalled();
      });
    });
    describe('onPress', () => {
      it('should run addOrRemoveFault with true', () => {
        spyOn(component, 'addOrRemoveFault');
        component.onPress();
        expect(component.addOrRemoveFault).toHaveBeenCalledWith(true);
      });
    });
    describe('toggleShowMeQuestion', () => {
      it('should swap selectedShowMeQuestion and dispatch store with VehicleChecksCompletedToggle', () => {
        component.selectedShowMeQuestion = true;
        component.toggleShowMeQuestion();
        expect(component.selectedShowMeQuestion).toEqual(false);
        expect(store$.dispatch).toHaveBeenCalledWith(VehicleChecksCompletedToggle());
      });
    });

    describe('addFault', () => {
      it('should dispatch VEHICLE_CHECK_SERIOUS_FAULT when serious mode is on', () => {
        fixture.detectChanges();
        component.isSeriousMode = true;
        component.addFault(false);
        expect(store$.dispatch).toHaveBeenCalledWith(VehicleChecksAddSeriousFault());
      });
      it('should dispatch VEHICLE_CHECK_DANGEROUS_FAULT when dangerous mode is on', () => {
        fixture.detectChanges();
        component.isDangerousMode = true;
        component.addFault(false);
        expect(store$.dispatch).toHaveBeenCalledWith(VehicleChecksAddDangerousFault());
      });
      it('should dispatch SHOW_ME_QUESTION_DRIVING_FAULT when competency is pressed', () => {
        fixture.detectChanges();
        component.addFault(true);
        expect(store$.dispatch).toHaveBeenCalledWith(ShowMeQuestionAddDrivingFault(0));
      });
      it('should not dispatch SHOW_ME_QUESTION_DRIVING_FAULT when competency was just tapped', () => {
        fixture.detectChanges();
        component.addFault(false);
        expect(store$.dispatch).not.toHaveBeenCalledWith(ShowMeQuestionAddDrivingFault(3));
      });
    });

    describe('removeFault', () => {
      it('should dispatch ShowMeQuestionRemoveFault with CompetencyOutcome D, '
        + 'VehicleChecksRemoveDangerousFault, ToggleDangerousFaultMode and ToggleRemoveFaultMode '
        + 'if hasDangerousFault, isDangerousMode and isRemoveFaultMode are all true', () => {
        spyOn(component, 'hasDangerousFault').and.returnValue(true);
        component.isDangerousMode = true;
        component.isRemoveFaultMode = true;
        component.removeFault();
        expect(store$.dispatch).toHaveBeenCalledWith(ShowMeQuestionRemoveFault(CompetencyOutcome.D));
        expect(store$.dispatch).toHaveBeenCalledWith(VehicleChecksRemoveDangerousFault());
        expect(store$.dispatch).toHaveBeenCalledWith(ToggleDangerousFaultMode());
        expect(store$.dispatch).toHaveBeenCalledWith(ToggleRemoveFaultMode());
      });
      it('should dispatch ShowMeQuestionRemoveFault with CompetencyOutcome S, '
        + 'VehicleChecksRemoveSeriousFault, ToggleSeriousFaultMode and ToggleRemoveFaultMode '
        + 'if hasSeriousFault, isSeriousMode and isRemoveFaultMode are all true', () => {
        spyOn(component, 'hasDangerousFault').and.returnValue(false);
        spyOn(component, 'hasSeriousFault').and.returnValue(true);
        component.isSeriousMode = true;
        component.isRemoveFaultMode = true;
        component.removeFault();
        expect(store$.dispatch).toHaveBeenCalledWith(ShowMeQuestionRemoveFault(CompetencyOutcome.S));
        expect(store$.dispatch).toHaveBeenCalledWith(VehicleChecksRemoveSeriousFault());
        expect(store$.dispatch).toHaveBeenCalledWith(ToggleSeriousFaultMode());
        expect(store$.dispatch).toHaveBeenCalledWith(ToggleRemoveFaultMode());
      });
      it('should dispatch ShowMeQuestionRemoveFault with CompetencyOutcome DF, '
        + 'ShowMeQuestionRemoveDrivingFault with showMeQuestionFaultCount - 1 and ToggleRemoveFaultMode '
        + 'if isDangerousMode and isSeriousMode are false '
        + 'and isRemoveFaultMode and hasShowMeDrivingFault are true', () => {
        spyOn(component, 'hasDangerousFault').and.returnValue(false);
        spyOn(component, 'hasSeriousFault').and.returnValue(false);
        spyOn(component, 'hasShowMeDrivingFault').and.returnValue(true);
        component.isSeriousMode = false;
        component.isDangerousMode = false;
        component.isRemoveFaultMode = true;
        component.showMeQuestionFaultCount = 2;
        component.removeFault();
        expect(store$.dispatch).toHaveBeenCalledWith(ShowMeQuestionRemoveFault(CompetencyOutcome.DF));
        expect(store$.dispatch).toHaveBeenCalledWith(ShowMeQuestionRemoveDrivingFault(1));
        expect(store$.dispatch).toHaveBeenCalledWith(ToggleRemoveFaultMode());
      });
    });

    describe('hasShowMeDrivingFault', () => {
      it('should return true if a show me driving fault exists', () => {
        component.vehicleChecks = {
          showMeQuestions: [
            {
              code: '123',
              outcome: CompetencyOutcome.DF,
            },
          ],
        };
        const outcome = component.hasShowMeDrivingFault();
        expect(outcome).toEqual(true);
      });

      it('should return false no show me driving fault exists', () => {
        component.vehicleChecks = {
          showMeQuestions: [
            {
              code: '123',
              outcome: CompetencyOutcome.P,
            },
          ],
        };

        const outcome = component.hasShowMeDrivingFault();
        expect(outcome).toEqual(false);
      });
    });

    describe('hasTellMeDrivingFault', () => {
      it('should return true if a tell me driving fault exists', () => {
        component.vehicleChecks = {
          tellMeQuestions: [
            {
              code: '123',
              outcome: CompetencyOutcome.DF,
            },
          ],
        };

        const outcome = component.hasTellMeDrivingFault();
        expect(outcome).toEqual(true);
      });

      it('should return false no tell me driving fault exists', () => {
        component.vehicleChecks = {
          tellMeQuestions: [
            {
              code: '123',
              outcome: CompetencyOutcome.P,
            },
          ],
        };

        const outcome = component.hasTellMeDrivingFault();
        expect(outcome).toEqual(false);
      });
    });
  });
});

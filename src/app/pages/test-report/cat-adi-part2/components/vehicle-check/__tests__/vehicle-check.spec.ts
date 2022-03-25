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
import { By } from '@angular/platform-browser';

import {
  TellMeQuestionOutcomeChanged,
  ShowMeQuestionAddDrivingFault,
  ShowMeQuestionRemoveDrivingFault,
  VehicleChecksAddSeriousFault,
  VehicleChecksAddDangerousFault,
  VehicleChecksRemoveSeriousFault,
  VehicleChecksRemoveDangerousFault,
} from '@store/tests/test-data/cat-adi-part2/vehicle-checks/vehicle-checks.cat-adi-part2.action';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { configureTestSuite } from 'ng-bullet';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
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

  configureTestSuite(() => {
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
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(VehicleCheckComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    store$.dispatch(StartTest(105, TestCategory.ADI2));
    spyOn(store$, 'dispatch');
  }));

  describe('Class', () => {
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

    xdescribe('removeFault', () => {
      it('should dispatch a SHOW_ME_QUESTION_REMOVE_DRIVING_FAULT action on remove fault', () => {
        store$.dispatch(ShowMeQuestionAddDrivingFault(0));
        fixture.detectChanges();
        component.isRemoveFaultMode = true;
        component.vehicleChecks.showMeQuestions = [
          {
            code: '123',
            outcome: 'DF',
          },
        ];
        component.isRemoveFaultMode = true;
        component.removeFault();
        expect(store$.dispatch).toHaveBeenCalledWith(ShowMeQuestionRemoveDrivingFault(-1));
      });
      it('should dispatch a VEHICLE_CHECK_REMOVE_SERIOUS_FAULT action if there is a serious fault', () => {
        store$.dispatch(VehicleChecksAddSeriousFault());
        fixture.detectChanges();
        component.isRemoveFaultMode = true;
        component.isSeriousMode = true;
        component.vehicleChecks.seriousFault = true;
        component.addOrRemoveFault(true);
        expect(store$.dispatch).toHaveBeenCalledWith(VehicleChecksRemoveSeriousFault());
      });
      it('should dispatch a VEHICLE_CHECK_REMOVE_DANGEROUS_FAULT action if there is a dangerous fault', () => {
        store$.dispatch(VehicleChecksAddDangerousFault());
        fixture.detectChanges();
        component.isRemoveFaultMode = true;
        component.isDangerousMode = true;
        component.vehicleChecks.dangerousFault = true;
        component.addOrRemoveFault();
        expect(store$.dispatch).toHaveBeenCalledWith(VehicleChecksRemoveDangerousFault());
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

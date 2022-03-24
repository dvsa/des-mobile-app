import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { VehicleCheckComponent } from '../vehicle-check';
import { IonicModule } from 'ionic-angular';
import { StoreModule, Store } from '@ngrx/store';
import { testReportReducer } from '../../../../test-report.reducer';
import { StoreModel } from '../../../../../../shared/models/store.model';
import { MockComponent } from 'ng-mocks';
import { CompetencyButtonComponent } from '../../../../components/competency-button/competency-button';
import { TickIndicatorComponent } from '../../../../../../components/common/tick-indicator/tick-indicator';
import {
  DrivingFaultsBadgeComponent,
} from '../../../../../../components/common/driving-faults-badge/driving-faults-badge';
import {
  SeriousFaultBadgeComponent,
} from '../../../../../../components/common/serious-fault-badge/serious-fault-badge';
import {
  DangerousFaultBadgeComponent,
} from '../../../../../../components/common/dangerous-fault-badge/dangerous-fault-badge';
import { StartTest } from '../../../../../../modules/tests/tests.actions';
import { By } from '@angular/platform-browser';

import {
  TellMeQuestionOutcomeChanged,
  ShowMeQuestionAddDrivingFault,
  ShowMeQuestionRemoveDrivingFault,
  VehicleChecksAddSeriousFault,
  VehicleChecksAddDangerousFault,
  VehicleChecksRemoveSeriousFault,
  VehicleChecksRemoveDangerousFault,
} from '../../../../../../modules/tests/test-data/cat-adi-part2/vehicle-checks/vehicle-checks.cat-adi-part2.action';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { configureTestSuite } from 'ng-bullet';
import { CompetencyOutcome } from '../../../../../../shared/models/competency-outcome';
import { TestData } from '@dvsa/mes-test-schema/categories/ADI2/partial';
import { TestData as CommonTestData } from '@dvsa/mes-test-schema/categories/common';
import { FaultCountProvider } from '../../../../../../providers/fault-count/fault-count';

describe('VehicleCheckComponent', () => {

  let fixture: ComponentFixture<VehicleCheckComponent>;
  let component: VehicleCheckComponent;
  let store$: Store<StoreModel>;

  const mockTestData: TestData | CommonTestData = {
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

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VehicleCheckComponent);
    component = fixture.componentInstance;
    store$ = TestBed.get(Store);
    store$.dispatch(new StartTest(105, TestCategory.ADI2));
  }));

  describe('Class', () => {
    describe('addFault', () => {
      it('should dispatch VEHICLE_CHECK_SERIOUS_FAULT when serious mode is on', () => {
        fixture.detectChanges();
        component.isSeriousMode = true;

        const storeDisptachSpy = spyOn(store$, 'dispatch');

        component.addFault(false);

        expect(storeDisptachSpy).toHaveBeenCalledWith(new VehicleChecksAddSeriousFault());
      });

      it('should dispatch VEHICLE_CHECK_DANGEROUS_FAULT when dangerous mode is on', () => {
        fixture.detectChanges();
        component.isDangerousMode = true;

        const storeDisptachSpy = spyOn(store$, 'dispatch');

        component.addFault(false);

        expect(storeDisptachSpy).toHaveBeenCalledWith(new VehicleChecksAddDangerousFault());
      });

      it('should dispatch SHOW_ME_QUESTION_DRIVING_FAULT when competency is pressed', () => {
        fixture.detectChanges();

        const storeDisptachSpy = spyOn(store$, 'dispatch');

        component.addFault(true);

        expect(storeDisptachSpy).toHaveBeenCalledWith(new ShowMeQuestionAddDrivingFault(0));
      });

      it('should not dispatch SHOW_ME_QUESTION_DRIVING_FAULT when competency was just tapped', () => {
        fixture.detectChanges();

        const storeDisptachSpy = spyOn(store$, 'dispatch');

        component.addFault(false);

        expect(storeDisptachSpy).not.toHaveBeenCalledWith(new ShowMeQuestionAddDrivingFault(3));
      });
    });

    describe('removeFault', () => {
      it('should dispatch a SHOW_ME_QUESTION_REMOVE_DRIVING_FAULT action on remove fault', () => {
        store$.dispatch(new ShowMeQuestionAddDrivingFault(0));
        fixture.detectChanges();

        component.isRemoveFaultMode = true;
        component.vehicleChecks.showMeQuestions = [
          {
            code: '123',
            outcome: 'DF',
          },
        ];

        component.isRemoveFaultMode = true;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.removeFault();

        expect(storeDispatchSpy).toHaveBeenCalledWith(
          new ShowMeQuestionRemoveDrivingFault(-1));
      });

      it('should dispatch a VEHICLE_CHECK_REMOVE_SERIOUS_FAULT action if there is a serious fault', () => {
        store$.dispatch(new VehicleChecksAddSeriousFault());
        fixture.detectChanges();

        component.isRemoveFaultMode = true;
        component.isSeriousMode = true;
        component.vehicleChecks.seriousFault = true;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault(true);

        expect(storeDispatchSpy).toHaveBeenCalledWith(
          new VehicleChecksRemoveSeriousFault());
      });

      it('should dispatch a VEHICLE_CHECK_REMOVE_DANGEROUS_FAULT action if there is a dangerous fault', () => {
        store$.dispatch(new VehicleChecksAddDangerousFault());
        fixture.detectChanges();

        component.isRemoveFaultMode = true;
        component.isDangerousMode = true;
        component.vehicleChecks.dangerousFault = true;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).toHaveBeenCalledWith(
          new VehicleChecksRemoveDangerousFault());
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

  describe('DOM', () => {
    it('should pass 0 driving faults to the driving faults badge component when no tell me fault', () => {
      fixture.detectChanges();
      component.tellMeQuestionFaultCount = 0;
      component.showMeQuestionFaultCount = 0;
      const drivingFaultsBadge = fixture.debugElement.query(By.css('.driving-faults'))
        .componentInstance as DrivingFaultsBadgeComponent;

      fixture.detectChanges();
      expect(drivingFaultsBadge.count).toBe(0);
    });

    it('should have a serious fault badge on if there was serious fault recorded against the vehicle checks', () => {
      store$.dispatch(new VehicleChecksAddSeriousFault());
      fixture.detectChanges();
      const seriousFaultBadge = fixture.debugElement.query(By.css('serious-fault-badge'))
        .componentInstance as SeriousFaultBadgeComponent;

      fixture.detectChanges();
      expect(seriousFaultBadge.showBadge).toBe(true);
    });

    it('should have a serious fault badge on if tell me has driving fault but vehicle checks has serious', () => {
      store$.dispatch(new TellMeQuestionOutcomeChanged(CompetencyOutcome.DF, 0));
      store$.dispatch(new VehicleChecksAddSeriousFault());
      fixture.detectChanges();
      const drivingFaultsBadge = fixture.debugElement.query(By.css('.driving-faults'))
        .componentInstance as DrivingFaultsBadgeComponent;

      fixture.detectChanges();
      expect(drivingFaultsBadge.count).toBe(1);

      const seriousFaultBadge = fixture.debugElement.query(By.css('serious-fault-badge'))
        .componentInstance as SeriousFaultBadgeComponent;

      fixture.detectChanges();
      expect(seriousFaultBadge.showBadge).toBe(true);
    });

    it('should have a dangerous fault badge on if there was serious fault recorded against vehicle checks', () => {
      store$.dispatch(new VehicleChecksAddDangerousFault());
      fixture.detectChanges();
      const dangerousFaultBadge = fixture.debugElement.query(By.css('dangerous-fault-badge'))
        .componentInstance as DangerousFaultBadgeComponent;

      fixture.detectChanges();
      expect(dangerousFaultBadge.showBadge).toBe(true);
    });

    it('should have a dangerous fault badge on if tell me has driving fault but vehicle checks has dangerous', () => {
      store$.dispatch(new TellMeQuestionOutcomeChanged(CompetencyOutcome.DF, 0));
      store$.dispatch(new VehicleChecksAddDangerousFault());
      fixture.detectChanges();

      const drivingFaultsBadge = fixture.debugElement.query(By.css('.driving-faults'))
        .componentInstance as DrivingFaultsBadgeComponent;

      fixture.detectChanges();
      expect(drivingFaultsBadge.count).toBe(1);

      const dangerousFaultBadge = fixture.debugElement.query(By.css('dangerous-fault-badge'))
        .componentInstance as DangerousFaultBadgeComponent;

      fixture.detectChanges();
      expect(dangerousFaultBadge.showBadge).toBe(true);
    });
  });
});

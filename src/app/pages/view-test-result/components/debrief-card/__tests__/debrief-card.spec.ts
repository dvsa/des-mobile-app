import { DebriefCardComponent } from '@pages/view-test-result/components/debrief-card/debrief-card';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { AppModule } from '@app/app.module';
import { TestDataUnion } from '@shared/unions/test-schema-unions';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { MockComponent } from 'ng-mocks';
import { DataRowWithListComponent } from '@pages/view-test-result/components/data-row-with-list/data-list-with-row';
import { DataRowCustomComponent } from '@components/common/data-row-custom/data-row-custom';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import {
  VehicleChecksDataRowComponent,
} from '@pages/view-test-result/components/vehicle-checks-data-row/vehicle-checks-data-row';
import { SpeedCardComponent } from '@pages/view-test-result/components/speed-card/speed-card';
import {
  SafetyDataRowComponent,
} from '@pages/view-test-result/components/safety-question-data-row/safety-question-data-row';
import {
  SafetyAndBalanceDataRowComponent,
} from '@pages/view-test-result/components/safety-and-balance-data-row/safety-and-balance-data-row';
import { FaultsDataRowComponent } from '@pages/view-test-result/components/faults-data-row/faults-data-row';
import {
  DataRowListItem,
  TestRequirementsLabels,
  ViewTestResultLabels,
} from '@pages/view-test-result/components/data-row-with-list/data-list-with-row.model';
import { manoeuvreTypeLabels } from '@shared/constants/competencies/catb-manoeuvres';
import { manoeuvreTypeLabelsCatC } from '@shared/constants/competencies/catc-manoeuvres';
import { QuestionProvider } from '@providers/question/question';
import { DataRowComponent } from '@components/common/data-row/data-row';

describe('DebriefCardComponent', () => {
  let fixture: ComponentFixture<DebriefCardComponent>;
  let component: DebriefCardComponent;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [
        DebriefCardComponent,
        MockComponent(DataRowWithListComponent),
        MockComponent(DataRowComponent),
        MockComponent(DataRowCustomComponent),
        MockComponent(TickIndicatorComponent),
        MockComponent(DrivingFaultsBadgeComponent),
        MockComponent(VehicleChecksDataRowComponent),
        MockComponent(SpeedCardComponent),
        MockComponent(SafetyDataRowComponent),
        MockComponent(SafetyAndBalanceDataRowComponent),
        MockComponent(FaultsDataRowComponent),
      ],
      imports: [
        AppModule,
        IonicModule,
        ComponentsModule,
      ],
      providers: [QuestionProvider],
    });

    fixture = TestBed.createComponent(DebriefCardComponent);
    component = fixture.componentInstance;
  }));

  describe('balanceQuestions', () => {
    it('should return balanceQuestions from data', () => {
      component.data = {
        safetyAndBalanceQuestions: { balanceQuestions: [{ code: '1' }, { code: '2' }] },
      } as TestDataUnion;
      expect(component.balanceQuestions)
        .toEqual([{ code: '1' }, { code: '2' }]);
    });
  });

  describe('safetyQuestions', () => {
    it('should return safetyQuestions from data', () => {
      component.data = {
        safetyAndBalanceQuestions: { safetyQuestions: [{ code: '1' }, { code: '2' }] },
      } as TestDataUnion;
      expect(component.safetyQuestions)
        .toEqual([{ code: '1' }, { code: '2' }]);
    });
  });

  describe('safetyQuestionsCatD', () => {
    it('should return safetyQuestions from data', () => {
      component.data = {
        safetyQuestions: { questions: [{ description: '1' }, { description: '2' }] },
      } as TestDataUnion;
      expect(component.safetyQuestionsCatD)
        .toEqual([{ description: '1' }, { description: '2' }]);
    });
  });

  describe('isCatADI2', () => {
    it('should return true if correct test outcome is Passed', () => {
      component.category = TestCategory.ADI2;
      expect(component.isCatADI2())
        .toEqual(true);
    });
    it('should return false if correct test outcome is not Passed', () => {
      component.category = TestCategory.B;
      expect(component.isCatADI2())
        .toEqual(false);
    });
  });

  describe('isCatB', () => {
    it('should return true if correct test outcome is Passed', () => {
      component.category = TestCategory.B;
      expect(component.isCatB())
        .toEqual(true);
    });
    it('should return false if correct test outcome is not Passed', () => {
      component.category = TestCategory.ADI2;
      expect(component.isCatB())
        .toEqual(false);
    });
  });

  describe('isCatManoeuvre', () => {
    it('should return true if correct test outcome is Passed', () => {
      component.category = TestCategory.CM;
      expect(component.isCatManoeuvre())
        .toEqual(true);
    });
    it('should return false if correct test outcome is not Passed', () => {
      component.category = TestCategory.ADI2;
      expect(component.isCatManoeuvre())
        .toEqual(false);
    });
  });

  describe('isRider', () => {
    it('should return true if correct category is passed', () => {
      component.category = TestCategory.EUA1M2;
      expect(component.isRider())
        .toEqual(true);
    });
    it('should return false if correct category is not passed', () => {
      component.category = TestCategory.ADI2;
      expect(component.isRider())
        .toEqual(false);
    });
  });

  describe('isMod1', () => {
    it('should return true if correct category is passed', () => {
      component.category = TestCategory.EUA1M1;
      expect(component.isMod1())
        .toEqual(true);
    });
    it('should return false if correct category is not passed', () => {
      component.category = TestCategory.ADI2;
      expect(component.isMod1())
        .toEqual(false);
    });
  });

  describe('isMod2', () => {
    it('should return true if correct category is passed', () => {
      component.category = TestCategory.EUA1M2;
      expect(component.isMod2())
        .toEqual(true);
    });
    it('should return false if correct category is not passed', () => {
      component.category = TestCategory.ADI2;
      expect(component.isMod2())
        .toEqual(false);
    });
  });

  describe('isCatD', () => {
    it('should return true if correct category is passed', () => {
      component.category = TestCategory.D;
      expect(component.isCatD())
        .toEqual(true);
    });
    it('should return false if correct category is not passed', () => {
      component.category = TestCategory.ADI2;
      expect(component.isCatD())
        .toEqual(false);
    });
  });

  describe('hideManoeuvre', () => {
    it('should return true if correct category is passed', () => {
      component.category = TestCategory.B;
      expect(component.hideManoeuvre())
        .toEqual(true);
    });
    it('should return false if correct category is not passed', () => {
      component.category = TestCategory.ADI2;
      expect(component.hideManoeuvre())
        .toEqual(false);
    });
  });

  describe('showControlledStop', () => {
    it('should return true if correct category is passed', () => {
      component.category = TestCategory.B;
      expect(component.showControlledStop())
        .toEqual(true);
    });
    it('should return false if correct category is not passed', () => {
      component.category = TestCategory.EUAM1;
      expect(component.showControlledStop())
        .toEqual(false);
    });
  });

  describe('showHighwayCode', () => {
    it('should return true if correct category is passed', () => {
      component.category = TestCategory.G;
      expect(component.showHighwayCode())
        .toEqual(true);
    });
    it('should return false if correct category is not passed', () => {
      component.category = TestCategory.EUAM1;
      expect(component.showHighwayCode())
        .toEqual(false);
    });
  });

  describe('showVehicleChecks', () => {
    it('should return true if correct category is passed', () => {
      component.category = TestCategory.ADI2;
      expect(component.showVehicleChecks())
        .toEqual(true);
    });
    it('should return false if correct test outcome is not passed', () => {
      component.category = TestCategory.EUAM1;
      expect(component.showVehicleChecks())
        .toEqual(false);
    });
  });

  describe('getMinDrivingFaultCount', () => {
    [
      TestCategory.C,
      TestCategory.D,
    ].forEach((value) => {
      it(`should return 12 if category is ${value}`, () => {
        component.category = value;
        expect(component.getMinDrivingFaultCount())
          .toEqual(12);
      });
    });
    [
      TestCategory.EUA1M2,
      TestCategory.ADI2,
    ].forEach((value) => {
      it(`should return 6 if the category is ${value}`, () => {
        component.category = value;
        expect(component.getMinDrivingFaultCount())
          .toEqual(6);
      });
    });
    it('should return 5 if the category is Mod1', () => {
      component.category = TestCategory.EUA1M1;
      expect(component.getMinDrivingFaultCount())
        .toEqual(5);
    });
    it('should return 15 if none of the cases apply', () => {
      component.category = TestCategory.B;
      expect(component.getMinDrivingFaultCount())
        .toEqual(15);
    });
  });

  describe('testRequirements', () => {
    it('should return data from getTestRequirementsCatADI2 if ADI2 is passed', () => {
      spyOn(component, 'getTestRequirementsCatADI2')
        .and
        .returnValue([{ label: '1' } as DataRowListItem]);
      component.category = TestCategory.ADI2;

      expect(component.testRequirements)
        .toEqual([{ label: '1' } as DataRowListItem]);
      expect(component.getTestRequirementsCatADI2)
        .toHaveBeenCalled();
    });
    it('should return data from getTestRequirementsCatB if B is passed', () => {
      spyOn(component, 'getTestRequirementsCatB')
        .and
        .returnValue([{ label: '1' } as DataRowListItem]);
      component.category = TestCategory.B;

      expect(component.testRequirements)
        .toEqual([{ label: '1' } as DataRowListItem]);
      expect(component.getTestRequirementsCatB)
        .toHaveBeenCalled();
    });
    it('should return data from getTestRequirementsCatB if category is C', () => {
      spyOn(component, 'getTestRequirementsCatC')
        .and
        .returnValue([{ label: '1' } as DataRowListItem]);
      component.category = TestCategory.C;

      expect(component.testRequirements)
        .toEqual([{ label: '1' } as DataRowListItem]);
      expect(component.getTestRequirementsCatC)
        .toHaveBeenCalled();
    });

    it('should return data from getTestRequirementsCatManoeuvre if category is CM', () => {
      spyOn(component, 'getTestRequirementsCatManoeuvre')
        .and
        .returnValue([{ label: '1' } as DataRowListItem]);
      component.category = TestCategory.CM;

      expect(component.testRequirements)
        .toEqual([{ label: '1' } as DataRowListItem]);
      expect(component.getTestRequirementsCatManoeuvre)
        .toHaveBeenCalled();
    });

    it('should return data from getTestRequirementsCatD if category is D', () => {
      spyOn(component, 'getTestRequirementsCatD')
        .and
        .returnValue([{ label: '1' } as DataRowListItem]);
      component.category = TestCategory.D;

      expect(component.testRequirements)
        .toEqual([{ label: '1' } as DataRowListItem]);
      expect(component.getTestRequirementsCatD)
        .toHaveBeenCalled();
    });

    it('should return data from getTestRequirementsCatHome if category is F', () => {
      spyOn(component, 'getTestRequirementsCatHome')
        .and
        .returnValue([{ label: '1' } as DataRowListItem]);
      component.category = TestCategory.F;

      expect(component.testRequirements)
        .toEqual([{ label: '1' } as DataRowListItem]);
      expect(component.getTestRequirementsCatHome)
        .toHaveBeenCalled();
    });

    it('should return an empty array if none of the other options apply', () => {
      component.category = TestCategory.EUA1M2;
      expect(component.testRequirements)
        .toEqual([]);
    });
  });

  describe('showTestRequirement', () => {
    it('should return false if category is CM', () => {
      component.category = TestCategory.CM;
      expect(component.showTestRequirement())
        .toEqual(false);
    });
    it('should return true if category is B', () => {
      component.category = TestCategory.B;
      expect(component.showTestRequirement())
        .toEqual(true);
    });
  });

  describe('getFlattenArray', () => {
    it('should return flattened array', () => {
      expect(component.getFlattenArray(['A', 'B', 'C']))
        .toEqual('A, B and C');
    });
  });

  describe('ETASeparator', () => {
    it('should return false if isMod2 is false while isValidEmergencyStopOrAvoidance is false'
      + 'and isMod1 is true', () => {
      spyOn(component, 'isMod2')
        .and
        .returnValue(false);
      spyOn(component, 'isValidEmergencyStopOrAvoidance')
        .and
        .returnValue(false);
      spyOn(component, 'isMod1')
        .and
        .returnValue(true);

      expect(component.ETASeparator())
        .toEqual(false);
    });
    it('should return true if isMod2 while isValidEmergencyStopOrAvoidance is false and isMod1 is true', () => {
      spyOn(component, 'isMod2')
        .and
        .returnValue(true);
      spyOn(component, 'isValidEmergencyStopOrAvoidance')
        .and
        .returnValue(false);
      spyOn(component, 'isMod1')
        .and
        .returnValue(true);

      expect(component.ETASeparator())
        .toEqual(true);
    });
    it('should return true if delegatedTest, isMod1 and isMod2 are all false '
      + 'while the other 2 statements are false', () => {
      spyOn(component, 'isMod2')
        .and
        .returnValue(false);
      spyOn(component, 'isValidEmergencyStopOrAvoidance')
        .and
        .returnValue(false);

      spyOn(component, 'isMod1')
        .and
        .returnValue(false);
      component.delegatedTest = false;

      expect(component.ETASeparator())
        .toEqual(true);
    });
    it('should return true if isValidEmergencyStopOrAvoidance while isMod1 is true and isMod2 is false', () => {
      spyOn(component, 'isMod2')
        .and
        .returnValue(false);
      spyOn(component, 'isValidEmergencyStopOrAvoidance')
        .and
        .returnValue(true);
      spyOn(component, 'isMod1')
        .and
        .returnValue(true);

      expect(component.ETASeparator())
        .toEqual(true);
    });
  });

  describe('isValidEmergencyStopOrAvoidance', () => {
    it('should return false if isMod1 is false while emergencyStop and avoidance are empty', () => {
      spyOn(component, 'isMod1')
        .and
        .returnValue(false);
      component.data = null;

      expect(component.ETASeparator())
        .toEqual(true);
    });
    it('should return true if isMod1 is true while emergencyStop is not empty'
      + 'and avoidance is empty', () => {
      spyOn(component, 'isMod1')
        .and
        .returnValue(true);
      component.data = { emergencyStop: { firstAttempt: true } } as TestDataUnion;

      expect(component.ETASeparator())
        .toEqual(true);
    });
    it('should return true if isMod1 is true while emergencyStop is empty'
      + 'and avoidance is not empty', () => {
      spyOn(component, 'isMod1')
        .and
        .returnValue(true);
      component.data = { avoidance: { secondAttempt: true } } as TestDataUnion;

      expect(component.ETASeparator())
        .toEqual(true);
    });
  });

  describe('getManoeuvres', () => {
    it('should push manoeuvres to an array if they are present', () => {
      component.data = {
        manoeuvres: {
          forwardPark: { selected: true },
          reverseParkCarpark: { selected: true },
          reverseParkRoad: { selected: true },
          reverseRight: { selected: true },
        },
      };
      expect(component.getManoeuvres())
        .toEqual([
          manoeuvreTypeLabels.forwardPark,
          manoeuvreTypeLabels.reverseParkCarpark,
          manoeuvreTypeLabels.reverseParkRoad,
          manoeuvreTypeLabels.reverseRight]);
    });
    it('should push None to an array if no manoeuvres are present', () => {
      component.data = {
        manoeuvres: null,
      };
      expect(component.getManoeuvres())
        .toEqual(['None']);
    });
  });

  describe('eTA', () => {
    it('should push ETA to an array if they are present', () => {
      component.data = {
        ETA: {
          physical: true,
          verbal: true,
        },
      };
      expect(component.eTA)
        .toEqual('Physical and Verbal');
    });
    it('should push None to an array if no ETA is present', () => {
      component.data = {
        ETA: null,
      };
      expect(component.getManoeuvres())
        .toEqual(['None']);
    });
  });
  describe('highwayCode', () => {
    it('should return an array containing an object with ViewTestResultLabels.completed and checked = true'
      + 'if highwayCodeSafety.selected is true', () => {
      component.data = {
        highwayCodeSafety: { selected: true },
      };
      expect(component.highwayCode)
        .toEqual([{
          label: ViewTestResultLabels.completed,
          checked: true,
        }]);
    });
    it('should return an array containing an object with ViewTestResultLabels.notCompleted and checked = false'
      + 'if highwayCodeSafety.selected is false', () => {
      component.data = {
        highwayCodeSafety: { selected: false },
      };
      expect(component.highwayCode)
        .toEqual([{
          label: ViewTestResultLabels.notCompleted,
          checked: false,
        }]);
    });
  });
  describe('controlledStop', () => {
    it('should return an array containing an object with ViewTestResultLabels.completed and checked = true'
      + 'if controlledStop.selected is true', () => {
      component.data = {
        controlledStop: { selected: true },
      };
      expect(component.controlledStop)
        .toEqual([{
          label: ViewTestResultLabels.completed,
          checked: true,
        }]);
    });
    it('should return an array containing an object with ViewTestResultLabels.notCompleted and checked = false'
      + 'if controlledStop.selected is false', () => {
      component.data = {
        controlledStop: { selected: false },
      };
      expect(component.controlledStop)
        .toEqual([{
          label: ViewTestResultLabels.notCompleted,
          checked: false,
        }]);
    });
  });
  describe('ngOnInit', () => {
    it('should call correct functions', () => {
      spyOn(component, 'getShowMeQuestion')
        .and
        .returnValue(null);
      spyOn(component, 'getTellMeQuestion')
        .and
        .returnValue(null);
      spyOn(component, 'getManoeuvres')
        .and
        .returnValue(null);

      component.ngOnInit();

      expect(component.getShowMeQuestion)
        .toHaveBeenCalled();
      expect(component.getTellMeQuestion)
        .toHaveBeenCalled();
      expect(component.getManoeuvres)
        .toHaveBeenCalled();
    });
  });
  describe('eco', () => {
    it('should return an array of objects populated with the correct data', () => {
      component.data = {
        eco: {
          adviceGivenControl: true,
          adviceGivenPlanning: true,
        },
      };
      expect(component.eco)
        .toEqual([
          {
            label: ViewTestResultLabels.control,
            checked: true,
          },
          {
            label: ViewTestResultLabels.planning,
            checked: true,
          },
        ]);
    });
  });
  describe('getTestRequirementsCatManoeuvre', () => {
    it('should return an array of objects populated with the correct data', () => {
      component.data = { uncoupleRecouple: { selected: true } };
      expect(component.getTestRequirementsCatManoeuvre())
        .toEqual([
          {
            label: TestRequirementsLabels.uncoupleRecouple,
            checked: true,
          },
        ]);
    });
  });
  describe('manoeuvre', () => {
    it('should return results of getManoeuvreADI if category is ADI2', () => {
      component.category = TestCategory.ADI2;
      expect(component.manoeuvre)
        .toEqual('None');
    });
    it('should return None if category is not a manoeuvre '
      + 'category or ADI2 and there is no reverseLeft value', () => {
      component.category = TestCategory.B;
      expect(component.manoeuvre)
        .toEqual('None');
    });
    it('should return manoeuvreTypeLabelsCatC.reverseLeft if category is a manoeuvre '
      + 'category and there is a reverseLeft value', () => {
      component.data = { manoeuvres: { reverseManoeuvre: { selected: true } } };
      component.category = TestCategory.CM;
      expect(component.manoeuvre)
        .toEqual(manoeuvreTypeLabelsCatC.reverseLeft);
    });
  });
  describe('getTestRequirementsCatHome', () => {
    it('should return an array of objects populated with the correct data', () => {
      component.data = {
        testRequirements: {
          normalStart1: true,
          normalStart2: true,
          angledStart: true,
          uphillStartDesignatedStart: false,
        },
      };
      expect(component.getTestRequirementsCatHome())
        .toEqual([
          {
            label: TestRequirementsLabels.normalStop1,
            checked: true,
          },
          {
            label: TestRequirementsLabels.normalStop2,
            checked: true,
          },
          {
            label: TestRequirementsLabels.angledStart,
            checked: true,
          },
          {
            label: TestRequirementsLabels.hillStart,
            checked: false,
          },
        ]);
    });
  });
  describe('getTestRequirementsCatB', () => {
    it('should return an array of objects populated with the correct data', () => {
      component.data = {
        testRequirements: {
          normalStart1: true,
          normalStart2: true,
          angledStart: true,
          hillStart: false,
        },
      };
      expect(component.getTestRequirementsCatB())
        .toEqual([
          {
            label: TestRequirementsLabels.normalStop1,
            checked: true,
          },
          {
            label: TestRequirementsLabels.normalStop2,
            checked: true,
          },
          {
            label: TestRequirementsLabels.angledStart,
            checked: true,
          },
          {
            label: TestRequirementsLabels.hillStart,
            checked: false,
          },
        ]);
    });
  });
  describe('getTestRequirementsCatADI2', () => {
    it('should return an array of objects populated with the correct data', () => {
      component.data = {
        testRequirements: {
          normalStart1: true,
          normalStart2: true,
          angledStart: true,
          uphillStart: false,
          downhillStart: false,
        },
      };
      expect(component.getTestRequirementsCatADI2())
        .toEqual([
          {
            label: TestRequirementsLabels.normalStop1,
            checked: true,
          },
          {
            label: TestRequirementsLabels.normalStop2,
            checked: true,
          },
          {
            label: TestRequirementsLabels.angledStart,
            checked: true,
          },
          {
            label: TestRequirementsLabels.uphillStart,
            checked: false,
          },
          {
            label: TestRequirementsLabels.downhillStart,
            checked: false,
          },
        ]);
    });
  });
  describe('tellMeQuestions', () => {
    it('should return an array containing tellMeQuestion if it is defined and category is B', () => {
      component.category = TestCategory.B;
      component.data = {
        vehicleChecks: { tellMeQuestion: { outcome: 'P' } },
      };
      expect(component.tellMeQuestions)
        .toEqual([{ outcome: 'P' }]);
    });
    it('should return an empty array if tellMeQuestion is not defined and category is B', () => {
      component.category = TestCategory.B;
      component.data = {
        vehicleChecks: { tellMeQuestion: null },
      };
      expect(component.tellMeQuestions)
        .toEqual([]);
    });
    it('should return defined questionRes.outcomes if category is not B', () => {
      component.category = TestCategory.ADI3;
      component.data = {
        vehicleChecks: { tellMeQuestions: [{ outcome: 'P' }, { outcome: undefined }, { outcome: 'DF' }] },
      };
      expect(component.tellMeQuestions)
        .toEqual([{ outcome: 'P' }, { outcome: 'DF' }]);
    });
  });
  describe('showMeQuestions', () => {
    it('should return an array containing showMeQuestion if it is defined and category is B', () => {
      component.category = TestCategory.B;
      component.data = {
        vehicleChecks: { showMeQuestion: { outcome: 'P' } },
      };
      expect(component.showMeQuestions)
        .toEqual([{ outcome: 'P' }]);
    });
    it('should return an empty array if showMeQuestion is not defined and category is B', () => {
      component.category = TestCategory.B;
      component.data = {
        vehicleChecks: { showMeQuestions: null },
      };
      expect(component.showMeQuestions)
        .toEqual([]);
    });
    it('should return defined questionRes.outcomes if category is not B', () => {
      component.category = TestCategory.ADI3;
      component.data = {
        vehicleChecks: { showMeQuestions: [{ outcome: 'P' }, { outcome: undefined }, { outcome: 'DF' }] },
      };
      expect(component.showMeQuestions)
        .toEqual([{ outcome: 'P' }, { outcome: 'DF' }]);
    });
  });
});

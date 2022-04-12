import { Component, Input, OnInit } from '@angular/core';
import { get } from 'lodash';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { manoeuvreTypeLabelsCatC } from '@shared/constants/competencies/catc-manoeuvres';
import { FaultSummary } from '@shared/models/fault-marking.model';
import { flattenArray } from '@pages/view-test-result/view-test-result-helpers';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { TestDataUnion } from '@shared/unions/test-schema-unions';
import { QuestionProvider } from '@providers/question/question';
import { manoeuvreTypeLabels } from '@shared/constants/competencies/catb-manoeuvres';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import {
  DataRowListItem,
  TestRequirementsLabels,
  ViewTestResultLabels,
} from '../data-row-with-list/data-list-with-row.model';

@Component({
  selector: 'debrief-card',
  templateUrl: 'debrief-card.html',
})
export class DebriefCardComponent implements OnInit {

  @Input()
  data: TestDataUnion;

  @Input()
  dangerousFaults: FaultSummary[];

  @Input()
  seriousFaults: FaultSummary[];

  @Input()
  drivingFaults: FaultSummary[];

  @Input()
  drivingFaultCount: number;

  @Input()
  category: TestCategory;

  @Input()
  delegatedTest: boolean = false;

  showMeQuestion: VehicleChecksQuestion;
  tellMeQuestion: VehicleChecksQuestion;
  manoeuvres: string[];

  constructor(private questionProvider: QuestionProvider) {
  }

  ngOnInit() {
    this.showMeQuestion = this.getShowMeQuestion();
    this.tellMeQuestion = this.getTellMeQuestion();
    this.manoeuvres = this.getManoeuvres();
  }

  getShowMeQuestion(): VehicleChecksQuestion {
    const showMeQuestionCode = get(this.data, 'vehicleChecks.showMeQuestion.code');
    return this.questionProvider
      .getShowMeQuestions(this.category as TestCategory)
      .find((question) => question.code === showMeQuestionCode);
  }

  getTellMeQuestion(): VehicleChecksQuestion {
    const tellMeQuestionCode = get(this.data, 'vehicleChecks.tellMeQuestion.code');
    return this.questionProvider
      .getTellMeQuestions(this.category as TestCategory)
      .find((question) => question.code === tellMeQuestionCode);
  }

  public get testRequirements(): DataRowListItem[] {
    switch (this.category) {
      case TestCategory.B:
        return this.getTestRequirementsCatB();
      case TestCategory.BE:
        return this.getTestRequirementsCatBE();
      case TestCategory.C:
      case TestCategory.C1:
      case TestCategory.CE:
      case TestCategory.C1E:
        return this.getTestRequirementsCatC();
      case TestCategory.CM:
      case TestCategory.C1M:
      case TestCategory.CEM:
      case TestCategory.C1EM:
      case TestCategory.DM:
      case TestCategory.D1M:
      case TestCategory.DEM:
      case TestCategory.D1EM:
        return this.getTestRequirementsCatManoeuvre();
      case TestCategory.D:
      case TestCategory.D1:
      case TestCategory.DE:
      case TestCategory.D1E:
        return this.getTestRequirementsCatD();
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
      case TestCategory.K:
        return this.getTestRequirementsCatHome();
      default:
        return [];
    }
  }

  public getMinDrivingFaultCount(): number {
    switch (this.category) {
      case TestCategory.C:
      case TestCategory.C1:
      case TestCategory.CE:
      case TestCategory.C1E:
      case TestCategory.D:
      case TestCategory.D1:
      case TestCategory.DE:
      case TestCategory.D1E:
        return 12; // Vocational
      case TestCategory.EUA1M1:
      case TestCategory.EUA2M1:
      case TestCategory.EUAM1:
      case TestCategory.EUAMM1:
        return 5; // Mod 1
      case TestCategory.EUA1M2:
      case TestCategory.EUA2M2:
      case TestCategory.EUAM2:
      case TestCategory.EUAMM2:
        return 6; // Mod 2
      default:
        return 15;
    }
  }

  public isCatB = (): boolean => isAnyOf(this.category, [TestCategory.B]);

  public isCatADI2 = (): boolean => isAnyOf(this.category, [TestCategory.ADI2]);

  public isRider = (): boolean => isAnyOf(this.category, [
    TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, TestCategory.EUAMM1, // Cat Mod1
    TestCategory.EUA1M2, TestCategory.EUA2M2, TestCategory.EUAM2, TestCategory.EUAMM2, // Cat Mod2
  ]);

  public isMod1 = (): boolean => isAnyOf(this.category, [
    TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, TestCategory.EUAMM1, // Cat Mod1
  ]);

  public isMod2 = (): boolean => isAnyOf(this.category, [
    TestCategory.EUA1M2, TestCategory.EUA2M2, TestCategory.EUAM2, TestCategory.EUAMM2, // Cat Mod2
  ]);

  public hideManoeuvre = (): boolean => isAnyOf(this.category, [
    TestCategory.B, // Cat B
    TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, TestCategory.EUAMM1, // Cat Mod1
    TestCategory.EUA1M2, TestCategory.EUA2M2, TestCategory.EUAM2, TestCategory.EUAMM2, // Cat Mod2
  ]);

  public showControlledStop: () => boolean = () => isAnyOf(this.category, [
    TestCategory.ADI2, // Cat ADI2
    TestCategory.B, // Cat B
    TestCategory.F, TestCategory.G, TestCategory.H, TestCategory.K, // Cat Home
  ]);

  public showHighwayCode: () => boolean = () => isAnyOf(this.category, [
    TestCategory.F, TestCategory.G, TestCategory.H, TestCategory.K, // Cat Home
  ]);

  public showVehicleChecks: () => boolean = () => isAnyOf(this.category, [
    TestCategory.ADI2, // Cat ADI2
    TestCategory.BE, // Cat BE
    TestCategory.C, TestCategory.C1, TestCategory.CE, TestCategory.C1E, // Cat C
    TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E, // Cat D
    TestCategory.F, TestCategory.G, TestCategory.H, TestCategory.K, // Cat Home
  ]);

  private getTestRequirementsCatB = (): DataRowListItem[] => {
    return [
      {
        label: TestRequirementsLabels.normalStop1,
        checked: get(this.data, 'testRequirements.normalStart1'),
      },
      {
        label: TestRequirementsLabels.normalStop2,
        checked: get(this.data, 'testRequirements.normalStart2'),
      },
      {
        label: TestRequirementsLabels.angledStart,
        checked: get(this.data, 'testRequirements.angledStart'),
      },
      {
        label: TestRequirementsLabels.hillStart,
        checked: get(this.data, 'testRequirements.hillStart'),
      },
    ];
  };

  private getTestRequirementsCatBE = (): DataRowListItem[] => {
    return [
      {
        label: TestRequirementsLabels.normalStop1,
        checked: get(this.data, 'testRequirements.normalStart1', false),
      },
      {
        label: TestRequirementsLabels.normalStop2,
        checked: get(this.data, 'testRequirements.normalStart2', false),
      },
      {
        label: TestRequirementsLabels.uphillStart,
        checked: get(this.data, 'testRequirements.uphillStart', false),
      },
      {
        label: TestRequirementsLabels.downhillStart,
        checked: get(this.data, 'testRequirements.downhillStart', false),
      },
      {
        label: TestRequirementsLabels.angledStartControlledStop,
        checked: get(this.data, 'testRequirements.angledStartControlledStop', false),
      },
      {
        label: TestRequirementsLabels.uncoupleRecouple,
        checked: get(this.data, 'uncoupleRecouple.selected', false),
      },
    ];
  };

  private getTestRequirementsCatC = (): DataRowListItem[] => {
    const testRequirements: DataRowListItem[] = [
      {
        label: TestRequirementsLabels.normalStop1,
        checked: get(this.data, 'testRequirements.normalStart1', false),
      },
      {
        label: TestRequirementsLabels.normalStop2,
        checked: get(this.data, 'testRequirements.normalStart2', false),
      },
      {
        label: TestRequirementsLabels.uphillStart,
        checked: get(this.data, 'testRequirements.uphillStart', false),
      },
      {
        label: TestRequirementsLabels.downhillStart,
        checked: get(this.data, 'testRequirements.downhillStart', false),
      },
      {
        label: TestRequirementsLabels.angledStartControlledStop,
        checked: get(this.data, 'testRequirements.angledStartControlledStop', false),
      },
    ];

    if (this.category === TestCategory.C1E || this.category === TestCategory.CE) {
      testRequirements.push({
        label: TestRequirementsLabels.uncoupleRecouple,
        checked: get(this.data, 'uncoupleRecouple.selected', false),
      });
    }

    return testRequirements;
  };

  private getTestRequirementsCatD = (): DataRowListItem[] => {
    const testRequirements: DataRowListItem[] = [
      {
        label: TestRequirementsLabels.normalStop1,
        checked: get(this.data, 'testRequirements.normalStart1', false),
      },
      {
        label: TestRequirementsLabels.normalStop2,
        checked: get(this.data, 'testRequirements.normalStart2', false),
      },
      {
        label: TestRequirementsLabels.busStop1,
        checked: get(this.data, 'testRequirements.busStop1', false),
      },
      {
        label: TestRequirementsLabels.busStop2,
        checked: get(this.data, 'testRequirements.busStop2', false),
      },
      {
        label: TestRequirementsLabels.uphillStart,
        checked: get(this.data, 'testRequirements.uphillStart', false),
      },
      {
        label: TestRequirementsLabels.downhillStart,
        checked: get(this.data, 'testRequirements.downhillStart', false),
      },
      {
        label: TestRequirementsLabels.angledStartControlledStop,
        checked: get(this.data, 'testRequirements.angledStartControlledStop', false),
      },
    ];

    if (this.category === TestCategory.D1E || this.category === TestCategory.DE) {
      testRequirements.push({
        label: TestRequirementsLabels.uncoupleRecouple,
        checked: get(this.data, 'uncoupleRecouple.selected', false),
      });
    }

    return testRequirements;
  };

  private getTestRequirementsCatHome = (): DataRowListItem[] => {
    return [
      {
        label: TestRequirementsLabels.normalStop1,
        checked: get(this.data, 'testRequirements.normalStart1', false),
      },
      {
        label: TestRequirementsLabels.normalStop2,
        checked: get(this.data, 'testRequirements.normalStart2', false),
      },
      {
        label: TestRequirementsLabels.angledStart,
        checked: get(this.data, 'testRequirements.angledStart', false),
      },
      {
        label: TestRequirementsLabels.hillStart,
        checked: get(this.data, 'testRequirements.uphillStartDesignatedStart', false),
      },
    ];
  };

  private getTestRequirementsCatManoeuvre = (): DataRowListItem[] => {
    return [
      {
        label: TestRequirementsLabels.uncoupleRecouple,
        checked: get(this.data, 'uncoupleRecouple.selected', false),
      },
    ];
  };

  public get manoeuvre(): string {
    if (this.isCatADI2()) {
      return this.getManoeuvreADI();
    }
    const isReverseLeftSelected = get(this.data, 'manoeuvres.reverseLeft.selected', false);
    return isReverseLeftSelected ? manoeuvreTypeLabelsCatC.reverseLeft : 'None';
  }

  private getManoeuvreADI(): string {
    const manoeuvres: CatADI2UniqueTypes.Manoeuvres[] = get(this.data, 'manoeuvres', []);
    const selectedManoeuvres: string[] = [];

    manoeuvres.map((manoeuvreObject: CatADI2UniqueTypes.Manoeuvres) => {
      if (manoeuvreObject) {
        Object.keys(manoeuvreObject).map((manoeuvre: string) => {
          if (manoeuvreObject[manoeuvre].selected) {
            selectedManoeuvres.push(manoeuvreTypeLabels[manoeuvre]);
          }
        });
      }
    });
    return selectedManoeuvres.length > 0 ? selectedManoeuvres.join(', ') : 'None';
  }

  public get eco(): DataRowListItem[] {
    return [
      {
        label: ViewTestResultLabels.control,
        checked: get(this.data, 'eco.adviceGivenControl', false),
      },
      {
        label: ViewTestResultLabels.planning,
        checked: get(this.data, 'eco.adviceGivenPlanning', false),
      },
    ];
  }

  public get eTA(): string {
    const eta: string[] = [];

    if (get(this.data, 'ETA.physical')) {
      eta.push('Physical');
    }
    if (get(this.data, 'ETA.verbal')) {
      eta.push('Verbal');
    }
    if (eta.length === 0) {
      eta.push('None');
    }
    return flattenArray(eta);
  }

  getManoeuvres(): string[] {
    const manoeuvres = [];

    if (get(this.data, 'manoeuvres.forwardPark.selected')) {
      manoeuvres.push(manoeuvreTypeLabels.forwardPark);
    }
    if (get(this.data, 'manoeuvres.reverseParkCarpark.selected')) {
      manoeuvres.push(manoeuvreTypeLabels.reverseParkCarpark);
    }
    if (get(this.data, 'manoeuvres.reverseParkRoad.selected')) {
      manoeuvres.push(manoeuvreTypeLabels.reverseParkRoad);
    }
    if (get(this.data, 'manoeuvres.reverseRight.selected')) {
      manoeuvres.push(manoeuvreTypeLabels.reverseRight);
    }

    if (manoeuvres.length === 0) {
      manoeuvres.push('None');
    }

    return manoeuvres;
  }

  public get highwayCode(): DataRowListItem[] {
    const isHighwayCodeSelected: boolean = get(this.data, 'highwayCodeSafety.selected', false);
    return [
      {
        label: isHighwayCodeSelected ? ViewTestResultLabels.completed : ViewTestResultLabels.notCompleted,
        checked: isHighwayCodeSelected,
      },
    ];
  }

  public get controlledStop(): DataRowListItem[] {
    const isControlledStopSelected: boolean = get(this.data, 'controlledStop.selected', false);
    return [
      {
        label: isControlledStopSelected ? ViewTestResultLabels.completed : ViewTestResultLabels.notCompleted,
        checked: isControlledStopSelected,
      },
    ];
  }

  getFlattenArray = (data: string[]): string => flattenArray(data);

  public get showMeQuestions(): QuestionResult[] {
    if (this.isCatB()) {
      const question: QuestionResult = get(this.data, 'vehicleChecks.showMeQuestion', null);
      return question ? [question] : [];
    }
    return get(this.data, 'vehicleChecks.showMeQuestions', [])
      .filter((questionRes: QuestionResult) => questionRes.outcome !== undefined);
  }

  public get tellMeQuestions(): QuestionResult[] {
    if (this.isCatB()) {
      const question: QuestionResult = get(this.data, 'vehicleChecks.tellMeQuestion', null);
      return question ? [question] : [];
    }
    return get(this.data, 'vehicleChecks.tellMeQuestions', [])
      .filter((questionRes: QuestionResult) => questionRes.outcome !== undefined);
  }

  public get safetyQuestions(): QuestionResult[] {
    return get(this.data, 'safetyAndBalanceQuestions.safetyQuestions', []);
  }

  public get balanceQuestions(): QuestionResult[] {
    return get(this.data, 'safetyAndBalanceQuestions.balanceQuestions', []);
  }
}

import { pickBy, get, has } from 'lodash';
import { CatCMUniqueTypes } from '@dvsa/mes-test-schema/categories/CM';
import { CatC1MUniqueTypes } from '@dvsa/mes-test-schema/categories/C1M';
import { CatCEMUniqueTypes } from '@dvsa/mes-test-schema/categories/CEM';
import { CatC1EMUniqueTypes } from '@dvsa/mes-test-schema/categories/C1EM';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { sumManoeuvreFaults } from '@shared/helpers/faults';
import { CatDMUniqueTypes } from '@dvsa/mes-test-schema/categories/DM';
import { CatDEMUniqueTypes } from '@dvsa/mes-test-schema/categories/DEM';
import { CatD1EMUniqueTypes } from '@dvsa/mes-test-schema/categories/D1EM';
import { CatD1MUniqueTypes } from '@dvsa/mes-test-schema/categories/D1M';

type ManoeuvreTestData =
    CatCMUniqueTypes.TestData
    | CatC1MUniqueTypes.TestData
    | CatCEMUniqueTypes.TestData
    | CatC1EMUniqueTypes.TestData
    | CatDMUniqueTypes.TestData
    | CatDEMUniqueTypes.TestData
    | CatD1EMUniqueTypes.TestData
    | CatD1MUniqueTypes.TestData;

export class FaultCountManoeuvreTestHelper {

  public static getManoeuvreCountIfAny(data: ManoeuvreTestData, competencyType: CompetencyOutcome): number {
    let manoeuvreCount: number = 0;
    const hasManoeuvre: boolean = has(data, 'manoeuvres');
    if (hasManoeuvre) {
      const manoeuvres = get(data, 'manoeuvres', {});
      manoeuvreCount = sumManoeuvreFaults(manoeuvres, competencyType);
    }
    return manoeuvreCount;
  }

  public static getSeriousFaultSumCountManoeuvreTest = (data: ManoeuvreTestData): number => {

    // The way how we store serious faults differs for certain competencies
    // Because of this we need to pay extra attention on summing up all of them
    const { seriousFaults, uncoupleRecouple } = data;

    const seriousFaultSumOfSimpleCompetencies = Object.keys(pickBy(seriousFaults)).length;
    const uncoupleRecoupleSeriousFaults = (uncoupleRecouple?.fault === CompetencyOutcome.S) ? 1 : 0;

    const result = seriousFaultSumOfSimpleCompetencies
            + uncoupleRecoupleSeriousFaults
            + FaultCountManoeuvreTestHelper.getManoeuvreCountIfAny(data, CompetencyOutcome.S);

    return result;
  };

  public static getDangerousFaultSumCountManoeuvreTest = (data: ManoeuvreTestData): number => {

    // The way how we store serious faults differs for certain competencies
    // Because of this we need to pay extra attention on summing up all of them
    const { dangerousFaults, uncoupleRecouple } = data;

    const dangerousFaultSumOfSimpleCompetencies = Object.keys(pickBy(dangerousFaults)).length;
    const uncoupleRecoupleDangerousFaults = (uncoupleRecouple?.fault === CompetencyOutcome.D) ? 1 : 0;

    const result = dangerousFaultSumOfSimpleCompetencies
            + uncoupleRecoupleDangerousFaults
            + FaultCountManoeuvreTestHelper.getManoeuvreCountIfAny(data, CompetencyOutcome.D);

    return result;
  };

}

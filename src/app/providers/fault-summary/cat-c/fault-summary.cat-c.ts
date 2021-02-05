import {
  endsWith, forOwn, get, transform,
} from 'lodash';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { CatC1EUniqueTypes } from '@dvsa/mes-test-schema/categories/C1E';
import { CatCEUniqueTypes } from '@dvsa/mes-test-schema/categories/CE';
import { CatC1UniqueTypes } from '@dvsa/mes-test-schema/categories/C1';
import { CommentSource, CompetencyIdentifiers, FaultSummary } from '../../../shared/models/fault-marking.model';
import { CompetencyDisplayName } from '../../../shared/models/competency-display-name';
import { CompetencyOutcome } from '../../../shared/models/competency-outcome';
import { ManoeuvreTypes } from '../../../../store/tests/test-data/test-data.constants';
import { getCompetencyFaults, getCompetencyComment } from '../../../shared/helpers/get-competency-faults';
import {
  manoeuvreCompetencyLabelsCatC,
  manoeuvreTypeLabelsCatC,
} from '../../../shared/constants/competencies/catc-manoeuvres';
import { VehicleChecksScore } from '../../../shared/models/vehicle-checks-score.model';

export class FaultSummaryCatCHelper {

  public static getDrivingFaultsNonTrailer(
    data: CatCUniqueTypes.TestData | CatC1UniqueTypes.TestData,
    category: TestCategory,
    vehicleChecksScore: VehicleChecksScore,
  ): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.drivingFaults),
      ...this.getManoeuvreFaultsCatC(data.manoeuvres, CompetencyOutcome.DF),
      ...this.getVehicleCheckDrivingFaultsCatC(data.vehicleChecks, category, vehicleChecksScore),
    ];
  }

  public static getSeriousFaultsNonTrailer(
    data: CatCUniqueTypes.TestData | CatC1UniqueTypes.TestData,
  ): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.seriousFaults),
      ...this.getManoeuvreFaultsCatC(data.manoeuvres, CompetencyOutcome.S),
      ...this.getVehicleCheckSeriousFaultsNonTrailer(data.vehicleChecks),
    ];
  }

  public static getDangerousFaultsNonTrailer(
    data: CatCUniqueTypes.TestData | CatC1UniqueTypes.TestData,
  ): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.dangerousFaults),
      ...this.getManoeuvreFaultsCatC(data.manoeuvres, CompetencyOutcome.D),
    ];
  }

  public static getDrivingFaultsTrailer(
    data: CatCEUniqueTypes.TestData | CatC1EUniqueTypes.TestData,
    category: TestCategory,
    vehicleChecksScore: VehicleChecksScore,
  ): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.drivingFaults),
      ...this.getManoeuvreFaultsCatC(data.manoeuvres, CompetencyOutcome.DF),
      ...this.getUncoupleRecoupleFault(data.uncoupleRecouple, CompetencyOutcome.DF),
      ...this.getVehicleCheckDrivingFaultsCatC(data.vehicleChecks, category, vehicleChecksScore),
    ];
  }

  public static getSeriousFaultsTrailer(
    data: CatCEUniqueTypes.TestData | CatC1EUniqueTypes.TestData,
  ): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.seriousFaults),
      ...this.getManoeuvreFaultsCatC(data.manoeuvres, CompetencyOutcome.S),
      ...this.getUncoupleRecoupleFault(data.uncoupleRecouple, CompetencyOutcome.S),
      ...this.getVehicleCheckSeriousFaultsTrailer(data.vehicleChecks),
    ];
  }

  public static getDangerousFaultsTrailer(
    data: CatCEUniqueTypes.TestData | CatC1EUniqueTypes.TestData,
  ): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.dangerousFaults),
      ...this.getManoeuvreFaultsCatC(data.manoeuvres, CompetencyOutcome.D),
      ...this.getUncoupleRecoupleFault(data.uncoupleRecouple, CompetencyOutcome.D),
    ];
  }

  private static createManoeuvreFaultCatC(key: string, type: ManoeuvreTypes, competencyComment: string): FaultSummary {
    const manoeuvreFaultSummary: FaultSummary = {
      comment: competencyComment || '',
      competencyIdentifier: `${type}${manoeuvreCompetencyLabelsCatC[key]}`,
      competencyDisplayName: `${manoeuvreTypeLabelsCatC[type]} - ${manoeuvreCompetencyLabelsCatC[key]}`,
      source: `${CommentSource.MANOEUVRES}-${type}-${manoeuvreCompetencyLabelsCatC[key]}`,
      faultCount: 1,
    };
    return manoeuvreFaultSummary;
  }

  private static getManoeuvreFaultsCatC(manoeuvres: CatCUniqueTypes.Manoeuvres, faultType: CompetencyOutcome)
    : FaultSummary[] {
    const faultsEncountered: FaultSummary[] = [];

    forOwn(manoeuvres, (manoeuvre: any, type: ManoeuvreTypes) => {
      const faults = !manoeuvre.selected ? [] : transform(manoeuvre, (result, value, key: string) => {

        if (endsWith(key, CompetencyIdentifiers.FAULT_SUFFIX) && value === faultType) {

          const competencyComment = getCompetencyComment(
            key,
            manoeuvre.controlFaultComments,
            manoeuvre.observationFaultComments,
          );

          result.push(this.createManoeuvreFaultCatC(key, type, competencyComment));
        }
      }, []);
      faultsEncountered.push(...faults);
    });
    return faultsEncountered;
  }

  private static getVehicleCheckDrivingFaultsCatC(
    vehicleChecks: CatCUniqueTypes.VehicleChecks,
    category: TestCategory,
    vehicleCheckFaults: VehicleChecksScore,
  )
    : FaultSummary[] {
    const result: FaultSummary[] = [];
    if (!vehicleChecks || !vehicleChecks.showMeQuestions || !vehicleChecks.tellMeQuestions) {
      return result;
    }

    const dangerousFaults = vehicleChecks.showMeQuestions.filter((fault) => fault.outcome === CompetencyOutcome.D);
    const seriousFaults = vehicleChecks.showMeQuestions.filter((fault) => fault.outcome === CompetencyOutcome.S);

    if (dangerousFaults.length > 0 || seriousFaults.length > 0) {
      return result;
    }

    if (vehicleCheckFaults.drivingFaults > 0) {
      const competency: FaultSummary = {
        comment: vehicleChecks.showMeTellMeComments || '',
        competencyIdentifier: CommentSource.VEHICLE_CHECKS,
        competencyDisplayName: CompetencyDisplayName.VEHICLE_CHECKS,
        source: CommentSource.VEHICLE_CHECKS,
        faultCount: vehicleCheckFaults.drivingFaults,
      };
      result.push(competency);
    }
    return result;
  }

  private static getVehicleCheckSeriousFaultsNonTrailer(
    vehicleChecks: CatCUniqueTypes.VehicleChecks,
  ): FaultSummary[] {
    const result: FaultSummary[] = [];

    if (!vehicleChecks) {
      return result;
    }

    const showMeQuestions: QuestionResult[] = get(vehicleChecks, 'showMeQuestions', []);
    const tellMeQuestions: QuestionResult[] = get(vehicleChecks, 'tellMeQuestions', []);

    const showMeFaults = showMeQuestions.filter((fault) => fault.outcome === CompetencyOutcome.DF);
    const tellMeFaults = tellMeQuestions.filter((fault) => fault.outcome === CompetencyOutcome.DF);

    const seriousFaultCount = showMeFaults.length + tellMeFaults.length === 5 ? 1 : 0;
    const competency: FaultSummary = {
      comment: vehicleChecks.showMeTellMeComments || '',
      competencyIdentifier: CommentSource.VEHICLE_CHECKS,
      competencyDisplayName: CompetencyDisplayName.VEHICLE_CHECKS,
      source: CommentSource.VEHICLE_CHECKS,
      faultCount: seriousFaultCount,
    };

    if (seriousFaultCount > 0) {
      result.push(competency);
    }

    return result;
  }

  private static getVehicleCheckSeriousFaultsTrailer(
    vehicleChecks: CatCUniqueTypes.VehicleChecks,
  ): FaultSummary[] {
    const result: FaultSummary[] = [];

    if (!vehicleChecks) {
      return result;
    }

    const showMeQuestions: QuestionResult[] = get(vehicleChecks, 'showMeQuestions', []);
    const tellMeQuestions: QuestionResult[] = get(vehicleChecks, 'tellMeQuestions', []);

    const showMeFaults = showMeQuestions.filter((fault) => fault.outcome === CompetencyOutcome.DF);
    const tellMeFaults = tellMeQuestions.filter((fault) => fault.outcome === CompetencyOutcome.DF);

    const seriousFaultCount = showMeFaults.length + tellMeFaults.length === 2 ? 1 : 0;
    const competency: FaultSummary = {
      comment: vehicleChecks.showMeTellMeComments || '',
      competencyIdentifier: CommentSource.VEHICLE_CHECKS,
      competencyDisplayName: CompetencyDisplayName.VEHICLE_CHECKS,
      source: CommentSource.VEHICLE_CHECKS,
      faultCount: seriousFaultCount,
    };

    if (seriousFaultCount > 0) {
      result.push(competency);
    }

    return result;
  }
  private static getUncoupleRecoupleFault(
    uncoupleRecouple: CatCEUniqueTypes.UncoupleRecouple | CatC1EUniqueTypes.UncoupleRecouple,
    faultType: CompetencyOutcome,
  )
    : FaultSummary[] {
    const returnCompetencies = [];
    if (!uncoupleRecouple || uncoupleRecouple.fault !== faultType) {
      return returnCompetencies;
    }
    const result: FaultSummary = {
      competencyDisplayName: CompetencyDisplayName.UNCOUPLE_RECOUPLE,
      competencyIdentifier: 'uncoupleRecouple',
      comment: uncoupleRecouple.faultComments || '',
      source: CommentSource.UNCOUPLE_RECOUPLE,
      faultCount: 1,
    };
    returnCompetencies.push(result);
    return returnCompetencies;
  }

}

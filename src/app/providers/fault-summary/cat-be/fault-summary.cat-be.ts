import {
  endsWith, forOwn, get, transform,
} from 'lodash';
import { EyesightTest, Manoeuvre, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { CatBEUniqueTypes } from '@dvsa/mes-test-schema/categories/BE';
import { CommentSource, CompetencyIdentifiers, FaultSummary } from '@shared/models/fault-marking.model';
import { CompetencyDisplayName } from '@shared/models/competency-display-name';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import {
  manoeuvreCompetencyLabels as manoeuvreCompetencyLabelsCatBe,
  manoeuvreTypeLabels as manoeuvreTypeLabelsCatBe,
} from '@shared/constants/competencies/catbe-manoeuvres';
import { getCompetencyFaults, getCompetencyComment } from '@shared/helpers/get-competency-faults';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';

export class FaultSummaryCatBEHelper {

  public static getDrivingFaultsCatBE(
    data: CatBEUniqueTypes.TestData,
    vehicleChecksScore: VehicleChecksScore,
  ): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.drivingFaults),
      ...this.getManoeuvreFaultsCatBE(data.manoeuvres, CompetencyOutcome.DF),
      ...this.getUncoupleRecoupleFault(data.uncoupleRecouple, CompetencyOutcome.DF),
      ...this.getVehicleCheckDrivingFaultsCatBE(data.vehicleChecks, vehicleChecksScore),
    ];
  }

  public static getSeriousFaultsCatBE(
    data: CatBEUniqueTypes.TestData,
  ): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.seriousFaults),
      ...this.getManoeuvreFaultsCatBE(data.manoeuvres, CompetencyOutcome.S),
      ...this.getUncoupleRecoupleFault(data.uncoupleRecouple, CompetencyOutcome.S),
      ...this.getVehicleCheckSeriousFaultsCatBE(data.vehicleChecks),
      ...this.getEyesightTestSeriousFault(data.eyesightTest),
    ];
  }

  public static getDangerousFaultsCatBE(
    data: CatBEUniqueTypes.TestData,
  ): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.dangerousFaults),
      ...this.getManoeuvreFaultsCatBE(data.manoeuvres, CompetencyOutcome.D),
      ...this.getUncoupleRecoupleFault(data.uncoupleRecouple, CompetencyOutcome.D),
    ];
  }

  private static getEyesightTestSeriousFault(eyesightTest: EyesightTest): FaultSummary[] {
    if (!eyesightTest || !eyesightTest.seriousFault) {
      return [];
    }
    return [{
      competencyDisplayName: CompetencyDisplayName.EYESIGHT_TEST,
      competencyIdentifier: CompetencyIdentifiers.EYESIGHT_TEST,
      comment: eyesightTest.faultComments || '',
      source: CommentSource.EYESIGHT_TEST,
      faultCount: 1,
    }];
  }

  private static getUncoupleRecoupleFault(
    uncoupleRecouple: CatBEUniqueTypes.UncoupleRecouple,
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

  private static createManoeuvreFaultCatBe(key: string, type: ManoeuvreTypes, competencyComment: string): FaultSummary {
    const manoeuvreFaultSummary: FaultSummary = {
      comment: competencyComment || '',
      competencyIdentifier: `${type}${manoeuvreCompetencyLabelsCatBe[key]}`,
      competencyDisplayName: `${manoeuvreTypeLabelsCatBe[type]} - ${manoeuvreCompetencyLabelsCatBe[key]}`,
      source: `${CommentSource.MANOEUVRES}-${type}-${manoeuvreCompetencyLabelsCatBe[key]}`,
      faultCount: 1,
    };
    return manoeuvreFaultSummary;
  }

  private static getManoeuvreFaultsCatBE(manoeuvres: CatBEUniqueTypes.Manoeuvres, faultType: CompetencyOutcome)
    : FaultSummary[] {
    const faultsEncountered: FaultSummary[] = [];

    forOwn(manoeuvres, (manoeuvre: Manoeuvre, type: ManoeuvreTypes) => {
      const faults = !manoeuvre.selected ? [] : transform(manoeuvre, (result, value, key: string) => {

        if (endsWith(key, 'Fault') && value === faultType) {

          const competencyComment = getCompetencyComment(
            key,
            manoeuvre.controlFaultComments,
            manoeuvre.observationFaultComments,
          );

          result.push(this.createManoeuvreFaultCatBe(key, type, competencyComment));
        }
      }, []);
      faultsEncountered.push(...faults);
    });
    return faultsEncountered;
  }

  private static getVehicleCheckSeriousFaultsCatBE(vehicleChecks: CatBEUniqueTypes.VehicleChecks): FaultSummary[] {
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

  private static getVehicleCheckDrivingFaultsCatBE(
    vehicleChecks: CatBEUniqueTypes.VehicleChecks,
    vehicleCheckFaults: VehicleChecksScore,
  ): FaultSummary[] {
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

}

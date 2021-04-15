import {
  endsWith, forOwn, get, transform,
} from 'lodash';
import { QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { CatD1EUniqueTypes } from '@dvsa/mes-test-schema/categories/D1E';
import { CatDEUniqueTypes } from '@dvsa/mes-test-schema/categories/DE';
import { CatD1UniqueTypes } from '@dvsa/mes-test-schema/categories/D1';
import { CommentSource, CompetencyIdentifiers, FaultSummary } from '@shared/models/fault-marking.model';
import { CompetencyDisplayName } from '@shared/models/competency-display-name';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { getCompetencyFaults, getCompetencyComment } from '@shared/helpers/get-competency-faults';
import {
  manoeuvreCompetencyLabelsCatD,
  manoeuvreTypeLabelsCatD,
} from '@shared/constants/competencies/catd-manoeuvres';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import { ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';

export type PcvDoorExerciseTypes =
| CatDUniqueTypes.PcvDoorExercise
| CatDEUniqueTypes.PcvDoorExercise
| CatD1UniqueTypes.PcvDoorExercise
| CatD1EUniqueTypes.PcvDoorExercise;

export class FaultSummaryCatDHelper {

  public static getDrivingFaultsNonTrailer(
    data: CatDUniqueTypes.TestData | CatD1UniqueTypes.TestData,
    category: TestCategory,
    vehicleChecksScore: VehicleChecksScore,
  ): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.drivingFaults),
      ...this.getManoeuvreFaultsCatD(data.manoeuvres, CompetencyOutcome.DF),
      ...this.getVehicleCheckDrivingFaultsCatD(data.vehicleChecks, category, vehicleChecksScore),
      ...this.getPCVDoorExerciseDrivingFault(data.pcvDoorExercise),
    ];
  }

  public static getSeriousFaultsNonTrailer(
    data: CatDUniqueTypes.TestData | CatD1UniqueTypes.TestData,
  ): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.seriousFaults),
      ...this.getManoeuvreFaultsCatD(data.manoeuvres, CompetencyOutcome.S),
      ...this.getVehicleCheckSeriousFaultsNonTrailer(data.vehicleChecks),
      ...this.getPCVDoorExerciseSeriousFault(data.pcvDoorExercise),
    ];
  }

  public static getDangerousFaultsNonTrailer(
    data: CatDUniqueTypes.TestData | CatD1UniqueTypes.TestData,
  ): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.dangerousFaults),
      ...this.getManoeuvreFaultsCatD(data.manoeuvres, CompetencyOutcome.D),
      ...this.getPCVDoorExerciseDangerousFault(data.pcvDoorExercise),
    ];
  }

  public static getDrivingFaultsTrailer(
    data: CatDEUniqueTypes.TestData | CatD1EUniqueTypes.TestData,
    category: TestCategory,
    vehicleChecksScore: VehicleChecksScore,
  ): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.drivingFaults),
      ...this.getManoeuvreFaultsCatD(data.manoeuvres, CompetencyOutcome.DF),
      ...this.getUncoupleRecoupleFault(data.uncoupleRecouple, CompetencyOutcome.DF),
      ...this.getVehicleCheckDrivingFaultsCatD(data.vehicleChecks, category, vehicleChecksScore),
      ...this.getPCVDoorExerciseDrivingFault(data.pcvDoorExercise),
    ];
  }

  public static getSeriousFaultsTrailer(
    data: CatDEUniqueTypes.TestData | CatD1EUniqueTypes.TestData,
  ): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.seriousFaults),
      ...this.getManoeuvreFaultsCatD(data.manoeuvres, CompetencyOutcome.S),
      ...this.getUncoupleRecoupleFault(data.uncoupleRecouple, CompetencyOutcome.S),
      ...this.getVehicleCheckSeriousFaultsTrailer(data.vehicleChecks),
      ...this.getPCVDoorExerciseSeriousFault(data.pcvDoorExercise),
    ];
  }

  public static getDangerousFaultsTrailer(
    data: CatDEUniqueTypes.TestData | CatD1EUniqueTypes.TestData,
  ): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.dangerousFaults),
      ...this.getManoeuvreFaultsCatD(data.manoeuvres, CompetencyOutcome.D),
      ...this.getUncoupleRecoupleFault(data.uncoupleRecouple, CompetencyOutcome.D),
      ...this.getPCVDoorExerciseDangerousFault(data.pcvDoorExercise),
    ];
  }

  private static createManoeuvreFaultCatD(key: string, type: ManoeuvreTypes, competencyComment: string): FaultSummary {
    const manoeuvreFaultSummary: FaultSummary = {
      comment: competencyComment || '',
      competencyIdentifier: `${type}${manoeuvreCompetencyLabelsCatD[key]}`,
      competencyDisplayName: `${manoeuvreTypeLabelsCatD[type]} - ${manoeuvreCompetencyLabelsCatD[key]}`,
      source: `${CommentSource.MANOEUVRES}-${type}-${manoeuvreCompetencyLabelsCatD[key]}`,
      faultCount: 1,
    };
    return manoeuvreFaultSummary;
  }

  private static getManoeuvreFaultsCatD(manoeuvres: CatDUniqueTypes.Manoeuvres, faultType: CompetencyOutcome)
    : FaultSummary[] {
    const faultsEncountered: FaultSummary[] = [];

    // TODO: Replace any with Manoeuvres and change the transform function
    forOwn(manoeuvres, (manoeuvre: any, type: ManoeuvreTypes) => {
      const faults = !manoeuvre.selected ? [] : transform(manoeuvre, (result, value, key: string) => {

        if (endsWith(key, CompetencyIdentifiers.FAULT_SUFFIX) && value === faultType) {

          const competencyComment = getCompetencyComment(
            key,
            manoeuvre.controlFaultComments,
            manoeuvre.observationFaultComments,
          );

          result.push(this.createManoeuvreFaultCatD(key, type, competencyComment));
        }
      }, []);
      faultsEncountered.push(...faults);
    });
    return faultsEncountered;
  }

  private static getVehicleCheckDrivingFaultsCatD(
    vehicleChecks: CatDUniqueTypes.VehicleChecks,
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
    vehicleChecks: CatDUniqueTypes.VehicleChecks,
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
    vehicleChecks: CatDUniqueTypes.VehicleChecks,
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

    return result;
  }

  private static getUncoupleRecoupleFault(
    uncoupleRecouple: CatDEUniqueTypes.UncoupleRecouple | CatD1EUniqueTypes.UncoupleRecouple,
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

  private static getPCVDoorExerciseDrivingFault(pcvDoorExercise: PcvDoorExerciseTypes) {
    if (!pcvDoorExercise || !pcvDoorExercise.drivingFault) {
      return [];
    }
    return [{
      competencyDisplayName: CompetencyDisplayName.PCV_DOOR_EXERCISE,
      competencyIdentifier: 'pcvDoorExercise',
      comment: pcvDoorExercise.drivingFaultComments || '',
      source: CommentSource.PCV_DOOR_EXERCISE,
      faultCount: 1,
    }];
  }

  private static getPCVDoorExerciseSeriousFault(pcvDoorExercise: PcvDoorExerciseTypes) {
    if (!pcvDoorExercise || !pcvDoorExercise.seriousFault) {
      return [];
    }
    return [{
      competencyDisplayName: CompetencyDisplayName.PCV_DOOR_EXERCISE,
      competencyIdentifier: 'pcvDoorExercise',
      comment: pcvDoorExercise.seriousFaultComments || '',
      source: CommentSource.PCV_DOOR_EXERCISE,
      faultCount: 1,
    }];
  }

  private static getPCVDoorExerciseDangerousFault(pcvDoorExercise: PcvDoorExerciseTypes) {
    if (!pcvDoorExercise || !pcvDoorExercise.dangerousFault) {
      return [];
    }
    return [{
      competencyDisplayName: CompetencyDisplayName.PCV_DOOR_EXERCISE,
      competencyIdentifier: 'pcvDoorExercise',
      comment: pcvDoorExercise.dangerousFaultComments || '',
      source: CommentSource.PCV_DOOR_EXERCISE,
      faultCount: 1,
    }];
  }
}

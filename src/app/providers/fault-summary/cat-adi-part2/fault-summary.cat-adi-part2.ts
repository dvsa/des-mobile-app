import {
  get, forOwn, // transform, endsWith,
} from 'lodash';
import { EyesightTest, QuestionResult, Manoeuvre } from '@dvsa/mes-test-schema/categories/common';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { CommentSource, CompetencyIdentifiers, FaultSummary } from '../../../shared/models/fault-marking.model';
import { CompetencyDisplayName } from '../../../shared/models/competency-display-name';
import { CompetencyOutcome } from '../../../shared/models/competency-outcome';
import { ManoeuvreTypes } from '../../../../store/tests/test-data/test-data.constants';
import {
  manoeuvreCompetencyLabels as manoeuvreCompetencyLabelsCatAdiPart2,
  manoeuvreTypeLabels as manoeuvreTypeLabelsCatAdiPart2,
} from '../../../shared/constants/competencies/catadi2-manoeuvres';
import { getCompetencyFaults } from '../../../shared/helpers/get-competency-faults'; // getCompetencyComment
import { VehicleChecksScore } from '../../../shared/models/vehicle-checks-score.model';

export class FaultSummaryCatAdiPart2Helper {

  public static getDrivingFaultsCatAdiPart2(
    data: CatADI2UniqueTypes.TestData,
    vehicleChecksScore: VehicleChecksScore,
  ): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.drivingFaults),
      ...this.getManoeuvreFaultsCatAdiPart2(data.manoeuvres), // CompetencyOutcome.DF
      ...this.getControlledStopFault(data.controlledStop, CompetencyOutcome.DF),
      ...this.getVehicleCheckDrivingFaultsCatAdiPart2(data.vehicleChecks, vehicleChecksScore),
    ];
  }

  public static getSeriousFaultsCatAdiPart2(data: CatADI2UniqueTypes.TestData): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.seriousFaults),
      ...this.getManoeuvreFaultsCatAdiPart2(data.manoeuvres), //  CompetencyOutcome.S
      ...this.getControlledStopFault(data.controlledStop, CompetencyOutcome.S),
      ...this.getVehicleCheckSeriousFaultsCatAdiPart2(data.vehicleChecks),
      ...this.getEyesightTestSeriousFault(data.eyesightTest),
    ];
  }

  public static getDangerousFaultsCatAdiPart2(data: CatADI2UniqueTypes.TestData): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.dangerousFaults),
      ...this.getManoeuvreFaultsCatAdiPart2(data.manoeuvres), // , CompetencyOutcome.D
      ...this.getControlledStopFault(data.controlledStop, CompetencyOutcome.D),
      ...this.getVehicleCheckDangerousFaultsCatAdiPart2(data.vehicleChecks),
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

  private static getControlledStopFault(controlledStop: CatADI2UniqueTypes.ControlledStop, faultType: CompetencyOutcome)
    : FaultSummary[] {
    const returnCompetencies: FaultSummary[] = [];
    if (!controlledStop || controlledStop.fault !== faultType) {
      return returnCompetencies;
    }
    const result: FaultSummary = {
      competencyDisplayName: CompetencyDisplayName.CONTROLLED_STOP,
      competencyIdentifier: CompetencyIdentifiers.CONTROLLED_STOP,
      comment: controlledStop.faultComments || '',
      source: CommentSource.CONTROLLED_STOP,
      faultCount: 1,
    };
    returnCompetencies.push(result);
    return returnCompetencies;
  }

  private static createManoeuvreFaultCatAdiPart2(
    key: string,
    type: ManoeuvreTypes,
    competencyComment: string,
    index: number,
  ): FaultSummary {
    const manoeuvreFaultSummary: FaultSummary = {
      comment: competencyComment || '',
      competencyIdentifier: `${type}${manoeuvreCompetencyLabelsCatAdiPart2[key]}`,
      competencyDisplayName:
        `${manoeuvreTypeLabelsCatAdiPart2[type]} - ${manoeuvreCompetencyLabelsCatAdiPart2[key]}`,
      source: `${CommentSource.MANOEUVRES}-${index}-${type}-${manoeuvreCompetencyLabelsCatAdiPart2[key]}`,
      faultCount: 1,
    };
    return manoeuvreFaultSummary;
  }

  private static getVehicleCheckDrivingFaultsCatAdiPart2(
    vehicleChecks: CatADI2UniqueTypes.VehicleChecks,
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

  private static getVehicleCheckSeriousFaultsCatAdiPart2(
    vehicleChecks: CatADI2UniqueTypes.VehicleChecks,
  ): FaultSummary[] {
    const result: FaultSummary[] = [];

    if (!vehicleChecks) {
      return result;
    }

    const showMeQuestions: QuestionResult[] = get(vehicleChecks, 'showMeQuestions', []);
    const tellMeQuestions: QuestionResult[] = get(vehicleChecks, 'tellMeQuestions', []);

    const showMeFaults = showMeQuestions.filter((fault) => fault.outcome === CompetencyOutcome.DF);
    const tellMeFaults = tellMeQuestions.filter((fault) => fault.outcome === CompetencyOutcome.DF);

    const seriousFaultCount = (vehicleChecks.seriousFault || (showMeFaults.length + tellMeFaults.length === 5)) ? 1 : 0;
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

  private static getVehicleCheckDangerousFaultsCatAdiPart2(
    vehicleChecks: CatADI2UniqueTypes.VehicleChecks,
  ): FaultSummary[] {
    const result: FaultSummary[] = [];

    if (!vehicleChecks) {
      return result;
    }

    const dangerousFaultCount = vehicleChecks.dangerousFault ? 1 : 0;
    const competency: FaultSummary = {
      comment: vehicleChecks.showMeTellMeComments || '',
      competencyIdentifier: CommentSource.VEHICLE_CHECKS,
      competencyDisplayName: CompetencyDisplayName.VEHICLE_CHECKS,
      source: CommentSource.VEHICLE_CHECKS,
      faultCount: dangerousFaultCount,
    };

    if (dangerousFaultCount > 0) {
      result.push(competency);
    }

    return result;
  }

  private static getManoeuvreFaultsCatAdiPart2(
    manoeuvres: CatADI2UniqueTypes.Manoeuvres[],
    // faultType: CompetencyOutcome,
  ): FaultSummary[] {
    const faultsEncountered: FaultSummary[] = [];

    manoeuvres.forEach((manoeuv) => { // , position
      forOwn(manoeuv, (manoeuvre: Manoeuvre) => { // type: ManoeuvreTypes
        let faults = [];

        if (!manoeuvre.selected) {
          faults = [];
        } else {
          /*
          faults = transform<Manoeuvre, FaultSummary>(manoeuvre as any, (result, value, key: string) => {
            if (endsWith(key, CompetencyIdentifiers.FAULT_SUFFIX) && value === faultType) {
              const competencyComment = getCompetencyComment(
                key,
                manoeuvre.controlFaultComments,
                manoeuvre.observationFaultComments,
              );
              result.push(this.createManoeuvreFaultCatAdiPart2(key, type, competencyComment, position));
            }
          }, []);
          */
        }

        faultsEncountered.push(...faults);
      });
    });

    return faultsEncountered;
  }
}

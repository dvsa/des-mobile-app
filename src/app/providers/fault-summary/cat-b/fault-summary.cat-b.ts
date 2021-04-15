import { endsWith, forOwn, transform } from 'lodash';
import { EyesightTest } from '@dvsa/mes-test-schema/categories/common';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { CommentSource, CompetencyIdentifiers, FaultSummary } from '@shared/models/fault-marking.model';
import { CompetencyDisplayName } from '@shared/models/competency-display-name';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import {
  manoeuvreCompetencyLabels as manoeuvreCompetencyLabelsCatB,
  manoeuvreTypeLabels as manoeuvreTypeLabelsCatB,
} from '@shared/constants/competencies/catb-manoeuvres';
import { getCompetencyFaults, getCompetencyComment } from '@shared/helpers/get-competency-faults';
import { ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';

export class FaultSummaryCatBHelper {

  public static getDrivingFaultsCatB(data: CatBUniqueTypes.TestData): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.drivingFaults),
      ...this.getManoeuvreFaultsCatB(data.manoeuvres, CompetencyOutcome.DF),
      ...this.getControlledStopFault(data.controlledStop, CompetencyOutcome.DF),
      ...this.getVehicleCheckFaultsCatB(data.vehicleChecks, CompetencyOutcome.DF),
    ];
  }

  public static getSeriousFaultsCatB(data: CatBUniqueTypes.TestData): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.seriousFaults),
      ...this.getManoeuvreFaultsCatB(data.manoeuvres, CompetencyOutcome.S),
      ...this.getControlledStopFault(data.controlledStop, CompetencyOutcome.S),
      ...this.getVehicleCheckFaultsCatB(data.vehicleChecks, CompetencyOutcome.S),
      ...this.getEyesightTestSeriousFault(data.eyesightTest),
    ];
  }

  public static getDangerousFaultsCatB(data: CatBUniqueTypes.TestData): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.dangerousFaults),
      ...this.getManoeuvreFaultsCatB(data.manoeuvres, CompetencyOutcome.D),
      ...this.getControlledStopFault(data.controlledStop, CompetencyOutcome.D),
      ...this.getVehicleCheckFaultsCatB(data.vehicleChecks, CompetencyOutcome.D),
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

  private static getControlledStopFault(controlledStop: CatBUniqueTypes.ControlledStop, faultType: CompetencyOutcome)
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

  private static createManoeuvreFaultCatB(key: string, type: ManoeuvreTypes, competencyComment: string): FaultSummary {
    const manoeuvreFaultSummary: FaultSummary = {
      comment: competencyComment || '',
      competencyIdentifier: `${type}${manoeuvreCompetencyLabelsCatB[key]}`,
      competencyDisplayName: `${manoeuvreTypeLabelsCatB[type]} - ${manoeuvreCompetencyLabelsCatB[key]}`,
      source: `${CommentSource.MANOEUVRES}-${type}-${manoeuvreCompetencyLabelsCatB[key]}`,
      faultCount: 1,
    };
    return manoeuvreFaultSummary;
  }

  private static getVehicleCheckFaultsCatB(vehicleChecks: CatBUniqueTypes.VehicleChecks, faultType: CompetencyOutcome)
    : FaultSummary[] {
    const result: FaultSummary[] = [];

    if (!vehicleChecks) {
      return result;
    }

    const isValidDangerousFault: boolean = faultType === CompetencyOutcome.D
      && vehicleChecks.showMeQuestion.outcome === CompetencyOutcome.D;

    const isValidSeriousFault: boolean = faultType === CompetencyOutcome.S
      && vehicleChecks.showMeQuestion.outcome === CompetencyOutcome.S;

    const isValidDrivingFault: boolean = faultType === CompetencyOutcome.DF
      && (
        vehicleChecks.showMeQuestion.outcome === CompetencyOutcome.DF
        || vehicleChecks.tellMeQuestion.outcome === CompetencyOutcome.DF
      );

    if (isValidDangerousFault || isValidSeriousFault || isValidDrivingFault) {
      const competency: FaultSummary = {
        comment: vehicleChecks.showMeTellMeComments || '',
        competencyIdentifier: CommentSource.VEHICLE_CHECKS,
        competencyDisplayName: CompetencyDisplayName.SHOW_ME_TELL_ME,
        source: CommentSource.VEHICLE_CHECKS,
        faultCount: 1,
      };

      result.push(competency);
    }
    return result;
  }

  private static getManoeuvreFaultsCatB(manoeuvres: CatBUniqueTypes.Manoeuvres, faultType: CompetencyOutcome)
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

          result.push(this.createManoeuvreFaultCatB(key, type, competencyComment));
        }
      }, []);
      faultsEncountered.push(...faults);
    });
    return faultsEncountered;
  }
}

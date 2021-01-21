import {
  endsWith, forOwn, transform, has, get,
} from 'lodash';
import { EyesightTest } from '@dvsa/mes-test-schema/categories/common';
import { CatFUniqueTypes } from '@dvsa/mes-test-schema/categories/F';
import { CatGUniqueTypes } from '@dvsa/mes-test-schema/categories/G';
import { CatHUniqueTypes } from '@dvsa/mes-test-schema/categories/H';
import { CatKUniqueTypes } from '@dvsa/mes-test-schema/categories/K';
import { CompetencyOutcome } from '../../../shared/models/competency-outcome';
import { CompetencyDisplayName } from '../../../shared/models/competency-display-name';
import { CommentSource, CompetencyIdentifiers, FaultSummary } from '../../../shared/models/fault-marking.model';
import { ManoeuvreTypes } from '../../../../store/tests/test-data/test-data.constants';
import {
  manoeuvreCompetencyLabels as manoeuvreCompetencyLabelsCatHomeTest,
  manoeuvreTypeLabels as manoeuvreTypeLabelsCatHomeTest,
} from '../../../shared/constants/competencies/catb-manoeuvres';
import { getCompetencyFaults, getCompetencyComment } from '../../../shared/helpers/get-competency-faults';

type HomeTestData = CatFUniqueTypes.TestData
| CatGUniqueTypes.TestData
| CatHUniqueTypes.TestData
| CatKUniqueTypes.TestData;

type HomeTestVehicleChecks = CatFUniqueTypes.VehicleChecks
| CatGUniqueTypes.VehicleChecks
| CatHUniqueTypes.VehicleChecks
| CatKUniqueTypes.VehicleChecks;

type HomeTestManoeuvres = CatFUniqueTypes.Manoeuvres
| CatGUniqueTypes.Manoeuvres
| CatHUniqueTypes.Manoeuvres;

export class FaultSummaryCatHomeTestHelper {

  public static getDrivingFaultsCatHomeTest(data: HomeTestData): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.drivingFaults),
      ...this.getManoeuvreFaultsIfAny(data, CompetencyOutcome.DF),
      ...this.getControlledStop(data, CompetencyOutcome.DF),
      ...this.getHighwayCodeSafety(data, 'drivingFault'),
      ...this.getVehicleCheckFaultsCatHomeTest(data.vehicleChecks, CompetencyOutcome.DF),
    ];
  }

  public static getSeriousFaultsCatHomeTest(data: HomeTestData): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.seriousFaults),
      ...this.getManoeuvreFaultsIfAny(data, CompetencyOutcome.S),
      ...this.getVehicleCheckFaultsCatHomeTest(data.vehicleChecks, CompetencyOutcome.S),
      ...this.getControlledStop(data, CompetencyOutcome.S),
      ...this.getHighwayCodeSafety(data, 'seriousFault'),
      ...this.getEyesightTestSeriousFault(data.eyesightTest),
    ];
  }

  public static getDangerousFaultsCatHomeTest(data: HomeTestData): FaultSummary[] {
    return [
      ...getCompetencyFaults(data.dangerousFaults),
      ...this.getManoeuvreFaultsIfAny(data, CompetencyOutcome.D),
      ...this.getVehicleCheckFaultsCatHomeTest(data.vehicleChecks, CompetencyOutcome.D),
      ...this.getControlledStop(data, CompetencyOutcome.D),
    ];
  }

  private static getControlledStop(data: HomeTestData, outcomeType: CompetencyOutcome): FaultSummary[] {
    const { controlledStop } = data;
    if (!controlledStop || !controlledStop.fault) {
      return [];
    }
    const controlledStopCount = (controlledStop && controlledStop.fault === outcomeType) ? 1 : 0;

    if (controlledStopCount > 0) {
      return [{
        competencyDisplayName: CompetencyDisplayName.CONTROLLED_STOP,
        competencyIdentifier: CompetencyIdentifiers.CONTROLLED_STOP,
        comment: controlledStop.faultComments || '',
        source: CommentSource.CONTROLLED_STOP,
        faultCount: controlledStopCount,
      }];
    }

    return [];
  }

  private static getHighwayCodeSafety(data: HomeTestData, property: string): FaultSummary[] {
    const { highwayCodeSafety } = data;
    if (!highwayCodeSafety) {
      return [];
    }

    const gotHighwayCodeSafetyFault: boolean = get(data, `highwayCodeSafety.${property}`, false);
    const highwayCodeSafetyCount = (gotHighwayCodeSafetyFault) ? 1 : 0;

    if (highwayCodeSafetyCount > 0) {
      return [{
        competencyDisplayName: CompetencyDisplayName.HIGHWAY_CODE_SAFETY,
        competencyIdentifier: CompetencyIdentifiers.HIGHWAY_CODE_SAFETY,
        comment: highwayCodeSafety.faultComments || '',
        source: CommentSource.HIGHWAY_CODE_SAFETY,
        faultCount: highwayCodeSafetyCount,
      }];
    }

    return [];
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

  private static createManoeuvreFaultCatHomeTest(
    key: string,
    type: ManoeuvreTypes,
    competencyComment: string,
  ): FaultSummary {
    const manoeuvreFaultSummary: FaultSummary = {
      comment: competencyComment || '',
      competencyIdentifier: `${type}${manoeuvreCompetencyLabelsCatHomeTest[key]}`,
      competencyDisplayName: `${manoeuvreTypeLabelsCatHomeTest[type]} - ${manoeuvreCompetencyLabelsCatHomeTest[key]}`,
      source: `${CommentSource.MANOEUVRES}-${type}-${manoeuvreCompetencyLabelsCatHomeTest[key]}`,
      faultCount: 1,
    };
    return manoeuvreFaultSummary;
  }

  private static getVehicleCheckFaultsCatHomeTest(
    vehicleChecks: HomeTestVehicleChecks,
    faultType: CompetencyOutcome,
  )
    : FaultSummary[] {
    const result: FaultSummary[] = [];

    if (!vehicleChecks || !vehicleChecks.showMeQuestions || !vehicleChecks.tellMeQuestions) {
      return result;
    }

    let faultCount:number = 0;

    vehicleChecks.showMeQuestions.map((fault) => {
      if (fault.outcome === faultType) {
        faultCount += 1;
      }
    });

    vehicleChecks.tellMeQuestions.map((fault) => {
      if (fault.outcome === faultType) {
        faultCount += 1;
      }
    });

    if (faultCount > 0) {
      const competency: FaultSummary = {
        comment: vehicleChecks.showMeTellMeComments || '',
        competencyIdentifier: CommentSource.VEHICLE_CHECKS,
        competencyDisplayName: CompetencyDisplayName.VEHICLE_CHECKS,
        source: CommentSource.VEHICLE_CHECKS,
        faultCount: 1,
      };
      result.push(competency);
    }
    return result;
  }

  public static getManoeuvreFaultsIfAny(
    data: HomeTestData,
    faultType: CompetencyOutcome,
  ):
    FaultSummary[] {
    const emptyResult: FaultSummary[] = [];
    const hasManoeuvre: boolean = has(data, 'manoeuvres');
    if (hasManoeuvre) {
      const manoeuvres = get(data, 'manoeuvres', {});
      return this.getManoeuvreFaultsCatHomeTest(manoeuvres, faultType);
    }
    return emptyResult;
  }

  private static getManoeuvreFaultsCatHomeTest(
    manoeuvres: HomeTestManoeuvres,
    faultType: CompetencyOutcome,
  )
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

          result.push(this.createManoeuvreFaultCatHomeTest(key, type, competencyComment));
        }
      }, []);
      faultsEncountered.push(...faults);
    });
    return faultsEncountered;
  }
}

import { Injectable } from '@angular/core';
import { get } from 'lodash';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { CatC1UniqueTypes } from '@dvsa/mes-test-schema/categories/C1';
import { CatC1EUniqueTypes } from '@dvsa/mes-test-schema/categories/C1E';
import { CatCEUniqueTypes } from '@dvsa/mes-test-schema/categories/CE';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestData } from '@dvsa/mes-test-schema/categories/common';
import { TestData as CatAMod1TestData } from '@dvsa/mes-test-schema/categories/AM1';
import { TestData as CatAMod2TestData } from '@dvsa/mes-test-schema/categories/AM2';
import {
  hasManoeuvreBeenCompletedCatADIPart2,
  hasVehicleChecksBeenCompletedCatADI2,
} from '@store/tests/test-data/cat-adi-part2/test-data.cat-adi-part2.selector';
import {
  hasManoeuvreBeenCompletedCatB,
  hasVehicleChecksBeenCompletedCatB,
} from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import {
  haveSafetyAndBalanceQuestionsBeenCompleted,
} from '@store/tests/test-data/cat-a-mod2/test-data.cat-a-mod2.selector';
import { legalRequirementsLabels } from '@shared/constants/legal-requirements/legal-requirements.constants';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { CatD1UniqueTypes } from '@dvsa/mes-test-schema/categories/D1';
import { CatDEUniqueTypes } from '@dvsa/mes-test-schema/categories/DE';
import { CatD1EUniqueTypes } from '@dvsa/mes-test-schema/categories/D1E';
import { CatHomeTestData, CatManoeuvreTestData } from '@shared/unions/test-schema-unions';
import { CatKUniqueTypes } from '@dvsa/mes-test-schema/categories/K';
import { hasManoeuvreBeenCompletedCatC } from '@store/tests/test-data/cat-c/test-data.cat-c.selector';
import { SpeedCheckState } from './test-report-validator.constants';
import { FaultCountProvider } from '../fault-count/fault-count';

@Injectable()
export class TestReportValidatorProvider {

  constructor(
    private faultCountProvider: FaultCountProvider,
  ) { }

  public isTestReportValid(data: object, category: TestCategory, isDelegated: boolean = false): boolean {
    switch (category) {
      case TestCategory.ADI2:
        return this.validateLegalRequirementsCatAdiPart2(data);
      case TestCategory.B:
        return this.validateLegalRequirementsCatB(data);
      case TestCategory.C1:
      case TestCategory.C:
        return this.validateLegalRequirementsCNonTrailer(data, isDelegated);
      case TestCategory.C1E:
      case TestCategory.CE:
        return this.validateLegalRequirementsCTrailer(data, isDelegated);
      case TestCategory.CM:
      case TestCategory.C1M:
      case TestCategory.DM:
      case TestCategory.D1M:
        return this.validateLegalRequirementsCatManoeuvre(data);
      case TestCategory.DEM:
      case TestCategory.D1EM:
      case TestCategory.CEM:
      case TestCategory.C1EM:
        return this.validateLegalRequirementsCatManoeuvreTrailer(data);
      case TestCategory.D:
        return this.validateLegalRequirementsCatD(data, isDelegated);
      case TestCategory.D1:
        return this.validateLegalRequirementsCatD1(data, isDelegated);
      case TestCategory.DE:
        return this.validateLegalRequirementsCatDE(data, isDelegated);
      case TestCategory.D1E:
        return this.validateLegalRequirementsCatD1E(data, isDelegated);
      case TestCategory.EUAM2:
      case TestCategory.EUA1M2:
      case TestCategory.EUA2M2:
      case TestCategory.EUAMM2:
        return this.validateLegalRequirementsCatEUAM2(data);
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
      case TestCategory.K:
        return this.validateLegalRequirementsCatHomeTest(data);
      default:
        return false;
    }
  }

  public getMissingLegalRequirements(
    data: object,
    category: TestCategory,
    isDelegated: boolean = false,
  ): legalRequirementsLabels[] {
    switch (category) {
      case TestCategory.ADI2:
        return this.getMissingLegalRequirementsCatAdiPart2(data);
      case TestCategory.B:
        return this.getMissingLegalRequirementsCatB(data);
      case TestCategory.C1:
      case TestCategory.C:
        return this.getMissingLegalRequirementsCNonTrailer(data, isDelegated);
      case TestCategory.C1E:
      case TestCategory.CE:
        return this.getMissingLegalRequirementsCTrailer(data, isDelegated);
      case TestCategory.CM:
      case TestCategory.C1M:
      case TestCategory.DM:
      case TestCategory.D1M:
        return this.getMissingLegalRequirementsCatManoeuvre(data);
      case TestCategory.DEM:
      case TestCategory.D1EM:
      case TestCategory.CEM:
      case TestCategory.C1EM:
        return this.getMissingLegalRequirementsCatManoeuvreTrailer(data);
      case TestCategory.D:
        return this.getMissingLegalRequirementsCatD(data, isDelegated);
      case TestCategory.D1:
        return this.getMissingLegalRequirementsCatD1(data, isDelegated);
      case TestCategory.DE:
        return this.getMissingLegalRequirementsCatDE(data, isDelegated);
      case TestCategory.D1E:
        return this.getMissingLegalRequirementsCatD1E(data, isDelegated);
      case TestCategory.EUA1M2:
      case TestCategory.EUA2M2:
      case TestCategory.EUAM2:
      case TestCategory.EUAMM2:
        return this.getMissingLegalRequirementsCatEUAM2(data);
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
        return this.getMissingLegalRequirementsCatHomeTest(data);
      case TestCategory.K:
        return this.getMissingLegalRequirementsCatK(data);
      default:
        return [];
    }
  }

  public isETAValid(data: TestData, category: TestCategory): boolean {
    const noEtaFaults = !(get(data, 'ETA.verbal') || get(data, 'ETA.physical'));

    return noEtaFaults
      || this.faultCountProvider.getDangerousFaultSumCount(category, data) !== 0
      || this.faultCountProvider.getSeriousFaultSumCount(category, data) !== 0;
  }

  public validateSpeedChecksCatAMod1(data: CatAMod1TestData): SpeedCheckState {

    const emergencyStopNotMet = get(data, 'emergencyStop.outcome');
    const avoidanceNotMet = get(data, 'avoidance.outcome');

    const emergencyStopFirstAttempt = get(data, 'emergencyStop.firstAttempt');
    const emergencyStopSecondAttempt = get(data, 'emergencyStop.secondAttempt');

    const avoidanceFirstAttempt = get(data, 'avoidance.firstAttempt');
    const avoidanceSecondAttempt = get(data, 'avoidance.secondAttempt');

    const emergencyStopOutcome = get(data, 'singleFaultCompetencies.emergencyStop');
    const avoidanceOutcome = get(data, 'singleFaultCompetencies.avoidance');

    if (emergencyStopNotMet === CompetencyOutcome.S) {
      if (emergencyStopFirstAttempt === undefined || emergencyStopSecondAttempt === undefined) {
        return SpeedCheckState.EMERGENCY_STOP_MISSING;
      }
      return SpeedCheckState.NOT_MET;
    }

    if (emergencyStopOutcome === CompetencyOutcome.S) {
      return SpeedCheckState.EMERGENCY_STOP_SERIOUS_FAULT;
    }

    if (emergencyStopOutcome === CompetencyOutcome.D) {
      return SpeedCheckState.EMERGENCY_STOP_DANGEROUS_FAULT;
    }

    if (avoidanceNotMet === CompetencyOutcome.S) {
      if (avoidanceFirstAttempt === undefined || avoidanceSecondAttempt === undefined) {
        return SpeedCheckState.AVOIDANCE_MISSING;
      }

      return SpeedCheckState.VALID;
    }

    if (emergencyStopFirstAttempt === undefined && avoidanceFirstAttempt === undefined) {
      return SpeedCheckState.EMERGENCY_STOP_AND_AVOIDANCE_MISSING;
    }

    if (emergencyStopFirstAttempt === undefined) {
      return SpeedCheckState.EMERGENCY_STOP_MISSING;
    }

    if (avoidanceFirstAttempt === undefined) {
      if (avoidanceOutcome === CompetencyOutcome.S || avoidanceOutcome === CompetencyOutcome.D) {
        return SpeedCheckState.VALID;
      }

      return SpeedCheckState.AVOIDANCE_MISSING;
    }

    return SpeedCheckState.VALID;
  }

  private validateLegalRequirementsCatAdiPart2(data: CatADI2UniqueTypes.TestData): boolean {
    const normalStart1: boolean = get(data, 'testRequirements.normalStart1', false);
    const normalStart2: boolean = get(data, 'testRequirements.normalStart2', false);
    const angledStart: boolean = get(data, 'testRequirements.angledStart', false);
    const uphillStart: boolean = get(data, 'testRequirements.uphillStart', false);
    const downhillStart: boolean = get(data, 'testRequirements.downhillStart', false);
    const manoeuvre: boolean = hasManoeuvreBeenCompletedCatADIPart2(data.manoeuvres) || false;
    const vehicleChecks: boolean = hasVehicleChecksBeenCompletedCatADI2(data.vehicleChecks) || false;
    const eco: boolean = get(data, 'eco.completed', false);

    return (
      normalStart1
      && normalStart2
      && angledStart
      && uphillStart
      && downhillStart
      && manoeuvre
      && vehicleChecks
      && eco
    );
  }

  private getMissingLegalRequirementsCatAdiPart2(data: CatADI2UniqueTypes.TestData): legalRequirementsLabels[] {
    const result: legalRequirementsLabels[] = [];

    if (!get(data, 'testRequirements.normalStart1', false)) result.push(legalRequirementsLabels.normalStart1);
    if (!get(data, 'testRequirements.normalStart2', false)) result.push(legalRequirementsLabels.normalStart2);
    if (!get(data, 'testRequirements.angledStart', false)) result.push(legalRequirementsLabels.angledStart);
    if (!get(data, 'testRequirements.uphillStart', false)) result.push(legalRequirementsLabels.uphillStart);
    if (!get(data, 'testRequirements.downhillStart', false)) result.push(legalRequirementsLabels.downhillStart);
    if (!hasManoeuvreBeenCompletedCatADIPart2(data.manoeuvres)) result.push(legalRequirementsLabels.manoeuvre);
    if (!hasVehicleChecksBeenCompletedCatADI2(data.vehicleChecks)) result.push(legalRequirementsLabels.vehicleChecks);
    if (!get(data, 'eco.completed', false)) result.push(legalRequirementsLabels.eco);

    return result;
  }

  private validateLegalRequirementsCatB(data: CatBUniqueTypes.TestData): boolean {
    const normalStart1: boolean = get(data, 'testRequirements.normalStart1', false);
    const normalStart2: boolean = get(data, 'testRequirements.normalStart2', false);
    const angledStart: boolean = get(data, 'testRequirements.angledStart', false);
    const hillStart: boolean = get(data, 'testRequirements.hillStart', false);
    const manoeuvre: boolean = hasManoeuvreBeenCompletedCatB(data) || false;
    const vehicleChecks: boolean = hasVehicleChecksBeenCompletedCatB(data) || false;
    const eco: boolean = get(data, 'eco.completed', false);

    return normalStart1 && normalStart2 && angledStart && hillStart && manoeuvre && vehicleChecks && eco;
  }

  private getMissingLegalRequirementsCatB(data: CatBUniqueTypes.TestData): legalRequirementsLabels[] {
    const result: legalRequirementsLabels[] = [];

    if (!get(data, 'testRequirements.normalStart1', false)) result.push(legalRequirementsLabels.normalStart1);
    if (!get(data, 'testRequirements.normalStart2', false)) result.push(legalRequirementsLabels.normalStart2);
    if (!get(data, 'testRequirements.angledStart', false)) result.push(legalRequirementsLabels.angledStart);
    if (!get(data, 'testRequirements.hillStart', false)) result.push(legalRequirementsLabels.hillStart);
    if (!hasManoeuvreBeenCompletedCatB(data)) result.push(legalRequirementsLabels.manoeuvre);
    if (!hasVehicleChecksBeenCompletedCatB(data)) result.push(legalRequirementsLabels.vehicleChecks);
    if (!get(data, 'eco.completed', false)) result.push(legalRequirementsLabels.eco);

    return result;
  }

  private validateLegalRequirementsCNonTrailer(
    data: CatCUniqueTypes.TestData | CatC1UniqueTypes.TestData,
    isDelegated: boolean,
  ): boolean {
    const normalStart1: boolean = get(data, 'testRequirements.normalStart1', false);
    const normalStart2: boolean = get(data, 'testRequirements.normalStart2', false);
    const uphillStart: boolean = get(data, 'testRequirements.uphillStart', false);
    const angledStartControlledStop: boolean = get(data, 'testRequirements.angledStartControlledStop', false);
    const manoeuvre: boolean = hasManoeuvreBeenCompletedCatC(data) || false;
    const eco: boolean = get(data, 'eco.completed', false);

    return !isDelegated ? (
      (normalStart1 || normalStart2)
      && uphillStart
      && angledStartControlledStop
      && eco
    ) : (
      angledStartControlledStop
        && manoeuvre
        && eco
    );
  }

  private getMissingLegalRequirementsCNonTrailer(
    data: CatCUniqueTypes.TestData | CatC1UniqueTypes.TestData,
    isDelegated: boolean,
  ): legalRequirementsLabels[] {
    const result: legalRequirementsLabels[] = [];

    if (!isDelegated) {
      if (!get(data, 'testRequirements.normalStart1', false)
        && !get(data, 'testRequirements.normalStart2', false)) result.push(legalRequirementsLabels.normalStart1);
      if (!get(data, 'testRequirements.uphillStart', false)) result.push(legalRequirementsLabels.uphillStart);
    }
    if (isDelegated && !hasManoeuvreBeenCompletedCatC(data)) {
      result.push(legalRequirementsLabels.manoeuvre);
    }
    if (!get(data, 'testRequirements.angledStartControlledStop', false)) {
      result.push(legalRequirementsLabels.angledStartControlledStop);
    }
    if (!get(data, 'eco.completed', false)) result.push(legalRequirementsLabels.eco);

    return result;
  }

  private validateLegalRequirementsCTrailer(
    data: CatCEUniqueTypes.TestData | CatC1EUniqueTypes.TestData,
    isDelegated: boolean,
  ): boolean {
    const normalStart1: boolean = get(data, 'testRequirements.normalStart1', false);
    const normalStart2: boolean = get(data, 'testRequirements.normalStart2', false);
    const uphillStart: boolean = get(data, 'testRequirements.uphillStart', false);
    const angledStartControlledStop: boolean = get(data, 'testRequirements.angledStartControlledStop', false);
    const eco: boolean = get(data, 'eco.completed', false);
    const manoeuvre: boolean = hasManoeuvreBeenCompletedCatC(data) || false;
    const uncoupleRecouple: boolean = get(data, 'uncoupleRecouple.selected', false);

    return !isDelegated ? (
      (normalStart1 || normalStart2)
      && uphillStart
      && angledStartControlledStop
      && eco
    ) : (
      angledStartControlledStop
      && manoeuvre
      && eco
      && uncoupleRecouple
    );
  }

  private getMissingLegalRequirementsCTrailer(
    data: CatCEUniqueTypes.TestData | CatC1EUniqueTypes.TestData,
    isDelegated: boolean,
  ): legalRequirementsLabels[] {
    const result: legalRequirementsLabels[] = [];

    if (!isDelegated) {
      if (!get(data, 'testRequirements.normalStart1', false)
        && !get(data, 'testRequirements.normalStart2', false)) result.push(legalRequirementsLabels.normalStart1);
      if (!get(data, 'testRequirements.uphillStart', false)) result.push(legalRequirementsLabels.uphillStart);
    }
    // only check for uncoupleRecouple/manoeuvre when delegated
    if (isDelegated) {
      if (!hasManoeuvreBeenCompletedCatC(data)) {
        result.push(legalRequirementsLabels.manoeuvre);
      }
      if (!get(data, 'uncoupleRecouple.selected', false)) {
        result.push(legalRequirementsLabels.uncoupleRecouple);
      }
    }

    if (!get(data, 'testRequirements.angledStartControlledStop', false)) {
      result.push(legalRequirementsLabels.angledStartControlledStop);
    }
    if (!get(data, 'eco.completed', false)) result.push(legalRequirementsLabels.eco);
    return result;
  }

  private getMissingLegalRequirementsCatManoeuvre(data: CatManoeuvreTestData): legalRequirementsLabels[] {
    const result: legalRequirementsLabels[] = [];

    if (!get(data, 'manoeuvres.reverseManoeuvre.selected', false)) result.push(legalRequirementsLabels.manoeuvre);

    return result;
  }

  private validateLegalRequirementsCatManoeuvre(data: CatManoeuvreTestData): boolean {
    const manoeuvre: boolean = get(data, 'manoeuvres.reverseManoeuvre.selected', false);

    return manoeuvre;
  }

  private getMissingLegalRequirementsCatManoeuvreTrailer(data: CatManoeuvreTestData): legalRequirementsLabels[] {
    const result: legalRequirementsLabels[] = [];

    if (!get(data, 'manoeuvres.reverseManoeuvre.selected', false)) result.push(legalRequirementsLabels.manoeuvre);
    if (!get(data, 'uncoupleRecouple.selected', false)) result.push(legalRequirementsLabels.uncoupleRecouple);

    return result;
  }

  private validateLegalRequirementsCatManoeuvreTrailer(data: CatManoeuvreTestData): boolean {
    const manoeuvre: boolean = get(data, 'manoeuvres.reverseManoeuvre.selected', false);
    const uncoupleRecouple = get(data, 'uncoupleRecouple.selected', false);

    return manoeuvre && uncoupleRecouple;
  }

  private validateLegalRequirementsCatD(data: CatDUniqueTypes.TestData, isDelegated: boolean): boolean {
    const normalStart1: boolean = get(data, 'testRequirements.normalStart1', false);
    const busStop1: boolean = get(data, 'testRequirements.busStop1', false);
    const busStop2: boolean = get(data, 'testRequirements.busStop2', false);
    const uphillStart: boolean = get(data, 'testRequirements.uphillStart', false);
    const manoeuvre: boolean = get(data, 'manoeuvres.reverseLeft.selected', false);
    const angledStartControlledStop: boolean = get(data, 'testRequirements.angledStartControlledStop', false);
    const eco: boolean = get(data, 'eco.completed', false);

    return !isDelegated ? (
      normalStart1
      && busStop1
      && busStop2
      && uphillStart
      && angledStartControlledStop
      && eco
    ) : (
      angledStartControlledStop
      && manoeuvre
      && eco
    );
  }

  private getMissingLegalRequirementsCatD(
    data: CatDUniqueTypes.TestData,
    isDelegated: boolean,
  ): legalRequirementsLabels[] {
    const result: legalRequirementsLabels[] = [];

    if (!isDelegated) {
      if (!get(data, 'testRequirements.normalStart1', false)) result.push(legalRequirementsLabels.normalStart1);
      if (!get(data, 'testRequirements.busStop1', false)) result.push(legalRequirementsLabels.busStop1);
      if (!get(data, 'testRequirements.busStop2', false)) result.push(legalRequirementsLabels.busStop2);
      if (!get(data, 'testRequirements.uphillStart', false)) result.push(legalRequirementsLabels.uphillStart);
    }
    if (isDelegated && !get(data, 'manoeuvres.reverseLeft.selected', false)) {
      result.push(legalRequirementsLabels.manoeuvre);
    }
    if (!get(data, 'testRequirements.angledStartControlledStop', false)) {
      result.push(legalRequirementsLabels.angledStartControlledStop);
    }
    if (!get(data, 'eco.completed', false)) result.push(legalRequirementsLabels.eco);

    return result;
  }

  private validateLegalRequirementsCatD1(data: CatD1UniqueTypes.TestData, isDelegated: boolean): boolean {
    const normalStart1: boolean = get(data, 'testRequirements.normalStart1', false);
    const uphillStart: boolean = get(data, 'testRequirements.uphillStart', false);
    const angledStartControlledStop: boolean = get(data, 'testRequirements.angledStartControlledStop', false);
    const manoeuvre: boolean = get(data, 'manoeuvres.reverseLeft.selected', false);
    const eco: boolean = get(data, 'eco.completed', false);

    return !isDelegated ? (
      normalStart1
      && uphillStart
      && angledStartControlledStop
      && eco
    ) : (
      angledStartControlledStop
      && manoeuvre
      && eco
    );
  }

  private getMissingLegalRequirementsCatD1(
    data: CatD1UniqueTypes.TestData,
    isDelegated: boolean,
  ): legalRequirementsLabels[] {
    const result: legalRequirementsLabels[] = [];

    if (!isDelegated) {
      if (!get(data, 'testRequirements.normalStart1', false)) result.push(legalRequirementsLabels.normalStart1);
      if (!get(data, 'testRequirements.uphillStart', false)) result.push(legalRequirementsLabels.uphillStart);
    }
    if (isDelegated && !get(data, 'manoeuvres.reverseLeft.selected', false)) {
      result.push(legalRequirementsLabels.manoeuvre);
    }
    if (!get(data, 'testRequirements.angledStartControlledStop', false)) {
      result.push(legalRequirementsLabels.angledStartControlledStop);
    }
    if (!get(data, 'eco.completed', false)) result.push(legalRequirementsLabels.eco);

    return result;
  }

  private validateLegalRequirementsCatDE(data: CatDEUniqueTypes.TestData, isDelegated: boolean): boolean {
    const normalStart1: boolean = get(data, 'testRequirements.normalStart1', false);
    const busStop1: boolean = get(data, 'testRequirements.busStop1', false);
    const busStop2: boolean = get(data, 'testRequirements.busStop2', false);
    const uphillStart: boolean = get(data, 'testRequirements.uphillStart', false);
    const angledStartControlledStop: boolean = get(data, 'testRequirements.angledStartControlledStop', false);
    const manoeuvre: boolean = get(data, 'manoeuvres.reverseLeft.selected', false);
    const eco: boolean = get(data, 'eco.completed', false);
    const uncoupleRecouple = get(data, 'uncoupleRecouple.selected', false);

    return !isDelegated ? (
      normalStart1
      && busStop1
      && busStop2
      && uphillStart
      && angledStartControlledStop
      && eco
    ) : (
      angledStartControlledStop
      && manoeuvre
      && eco
      && uncoupleRecouple
    );
  }

  private getMissingLegalRequirementsCatDE(
    data: CatDEUniqueTypes.TestData,
    isDelegated: boolean,
  ): legalRequirementsLabels[] {
    const result: legalRequirementsLabels[] = [];

    if (!isDelegated) {
      if (!get(data, 'testRequirements.normalStart1', false)) result.push(legalRequirementsLabels.normalStart1);
      if (!get(data, 'testRequirements.busStop1', false)) result.push(legalRequirementsLabels.busStop1);
      if (!get(data, 'testRequirements.busStop2', false)) result.push(legalRequirementsLabels.busStop2);
      if (!get(data, 'testRequirements.uphillStart', false)) result.push(legalRequirementsLabels.uphillStart);
    }
    // only check for uncoupleRecouple/manoeuvre when delegated
    if (isDelegated) {
      if (!get(data, 'manoeuvres.reverseLeft.selected', false)) {
        result.push(legalRequirementsLabels.manoeuvre);
      }
      if (!get(data, 'uncoupleRecouple.selected', false)) {
        result.push(legalRequirementsLabels.uncoupleRecouple);
      }
    }
    if (!get(data, 'testRequirements.angledStartControlledStop', false)) {
      result.push(legalRequirementsLabels.angledStartControlledStop);
    }
    if (!get(data, 'eco.completed', false)) result.push(legalRequirementsLabels.eco);

    return result;
  }

  private validateLegalRequirementsCatD1E(
    data: CatD1EUniqueTypes.TestData,
    isDelegated: boolean,
  ): boolean {
    const normalStart1: boolean = get(data, 'testRequirements.normalStart1', false);
    const uphillStart: boolean = get(data, 'testRequirements.uphillStart', false);
    const angledStartControlledStop: boolean = get(data, 'testRequirements.angledStartControlledStop', false);
    const manoeuvre: boolean = get(data, 'manoeuvres.reverseLeft.selected', false);
    const eco: boolean = get(data, 'eco.completed', false);
    const uncoupleRecouple = get(data, 'uncoupleRecouple.selected', false);

    return !isDelegated ? (
      normalStart1
      && uphillStart
      && angledStartControlledStop
      && eco
    ) : (
      angledStartControlledStop
      && manoeuvre
      && eco
      && uncoupleRecouple
    );
  }

  private getMissingLegalRequirementsCatD1E(
    data: CatD1EUniqueTypes.TestData,
    isDelegated: boolean,
  ): legalRequirementsLabels[] {
    const result: legalRequirementsLabels[] = [];

    if (!isDelegated) {
      if (!get(data, 'testRequirements.normalStart1', false)) result.push(legalRequirementsLabels.normalStart1);
      if (!get(data, 'testRequirements.uphillStart', false)) result.push(legalRequirementsLabels.uphillStart);
    }
    // only check for uncoupleRecouple/manoeuvre when delegated
    if (isDelegated) {
      if (!get(data, 'manoeuvres.reverseLeft.selected', false)) {
        result.push(legalRequirementsLabels.manoeuvre);
      }
      if (!get(data, 'uncoupleRecouple.selected', false)) {
        result.push(legalRequirementsLabels.uncoupleRecouple);
      }
    }
    if (!get(data, 'testRequirements.angledStartControlledStop', false)) {
      result.push(legalRequirementsLabels.angledStartControlledStop);
    }
    if (!get(data, 'eco.completed', false)) result.push(legalRequirementsLabels.eco);

    return result;
  }

  private validateLegalRequirementsCatEUAM2(data: CatAMod2TestData): boolean {
    const normalStart1: boolean = get(data, 'testRequirements.normalStart1', false);
    const normalStart2: boolean = get(data, 'testRequirements.normalStart2', false);
    const angledStart: boolean = get(data, 'testRequirements.angledStart', false);
    const hillStart: boolean = get(data, 'testRequirements.hillStart', false);
    const safetyBalanceQuestions: boolean = haveSafetyAndBalanceQuestionsBeenCompleted(data.safetyAndBalanceQuestions);
    const eco: boolean = get(data, 'eco.completed', false);

    return normalStart1 && normalStart2 && angledStart && hillStart && safetyBalanceQuestions && eco;
  }

  private getMissingLegalRequirementsCatEUAM2(data: CatAMod2TestData): legalRequirementsLabels[] {
    const result: legalRequirementsLabels[] = [];

    if (!get(data, 'testRequirements.normalStart1', false)) result.push(legalRequirementsLabels.normalStart1);
    if (!get(data, 'testRequirements.normalStart2', false)) result.push(legalRequirementsLabels.normalStart2);
    if (!get(data, 'testRequirements.angledStart', false)) result.push(legalRequirementsLabels.angledStart);
    if (!get(data, 'testRequirements.hillStart', false)) result.push(legalRequirementsLabels.hillStart);
    if (!haveSafetyAndBalanceQuestionsBeenCompleted(data.safetyAndBalanceQuestions)) {
      result.push(legalRequirementsLabels.safetyAndBalanceQuestions);
    }
    if (!get(data, 'eco.completed', false)) result.push(legalRequirementsLabels.eco);

    return result;
  }

  private validateLegalRequirementsCatHomeTest(data: CatHomeTestData): boolean {
    const normalStart1: boolean = get(data, 'testRequirements.normalStart1', false);
    const angledStart: boolean = get(data, 'testRequirements.angledStart', false);
    const controlledStop: boolean = get(data, 'controlledStop.selected', false);
    const uphillStartDesignatedStart: boolean = get(data, 'testRequirements.uphillStartDesignatedStart', false);

    const hCodeSafetyQuestions: boolean = get(data, 'highwayCodeSafety.selected', false);

    const eco: boolean = get(data, 'eco.completed', false);

    return normalStart1 && angledStart
      && uphillStartDesignatedStart && hCodeSafetyQuestions && eco && controlledStop;
  }

  private getMissingLegalRequirementsCatHomeTest(data: CatHomeTestData): legalRequirementsLabels[] {
    const result: legalRequirementsLabels[] = [];

    if (!get(data, 'testRequirements.normalStart1', false)) result.push(legalRequirementsLabels.normalStart1);
    if (!get(data, 'testRequirements.angledStart', false)) result.push(legalRequirementsLabels.angledStart);
    if (!get(data, 'testRequirements.uphillStartDesignatedStart', false)) {
      result.push(legalRequirementsLabels.uphillStartDesignatedStart);
    }
    if (!get(data, 'manoeuvres.reverseLeft.selected', false)) {
      result.push(legalRequirementsLabels.manoeuvre);
    }
    if (!get(data, 'highwayCodeSafety.selected', false)) result.push(legalRequirementsLabels.highwayCodeSafety);
    if (!get(data, 'eco.completed', false)) result.push(legalRequirementsLabels.eco);
    if (!get(data, 'controlledStop.selected', false)) result.push(legalRequirementsLabels.controlledStop);

    return result;
  }

  private getMissingLegalRequirementsCatK(data: CatKUniqueTypes.TestData): legalRequirementsLabels[] {
    const result: legalRequirementsLabels[] = [];

    if (!get(data, 'testRequirements.normalStart1', false)) result.push(legalRequirementsLabels.normalStart1);
    if (!get(data, 'testRequirements.angledStart', false)) result.push(legalRequirementsLabels.angledStart);
    if (!get(data, 'testRequirements.uphillStartDesignatedStart', false)) {
      result.push(legalRequirementsLabels.uphillStartDesignatedStart);
    }
    if (!get(data, 'highwayCodeSafety.selected', false)) result.push(legalRequirementsLabels.highwayCodeSafety);
    if (!get(data, 'eco.completed', false)) result.push(legalRequirementsLabels.eco);
    if (!get(data, 'controlledStop.selected', false)) result.push(legalRequirementsLabels.controlledStop);

    return result;
  }

}

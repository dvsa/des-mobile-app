import { Injectable } from '@angular/core';
import { get } from 'lodash';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { CatBEUniqueTypes } from '@dvsa/mes-test-schema/categories/BE';
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
import { haveSafetyAndBalanceQuestionsBeenCompleted }
  from '@store/tests/test-data/cat-a-mod2/test-data.cat-a-mod2.selector';
import { hasManoeuvreBeenCompletedCatBE } from '@store/tests/test-data/cat-be/test-data.cat-be.selector';
import { hasManoeuvreBeenCompletedCatC } from '@store/tests/test-data/cat-c/test-data.cat-c.selector';
import { legalRequirementsLabels } from '@shared/constants/legal-requirements/legal-requirements.constants';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { CatD1UniqueTypes } from '@dvsa/mes-test-schema/categories/D1';
import { CatDEUniqueTypes } from '@dvsa/mes-test-schema/categories/DE';
import { CatD1EUniqueTypes } from '@dvsa/mes-test-schema/categories/D1E';
// import { HomeTestData } from '../../pages/view-test-result/cat-home-test/components/debrief-card/debrief-card';
import { CatKUniqueTypes } from '@dvsa/mes-test-schema/categories/K';
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
        return TestReportValidatorProvider.validateLegalRequirementsCatAdiPart2(data);
      case TestCategory.B:
        return this.validateLegalRequirementsCatB(data);
      case TestCategory.BE:
        return this.validateLegalRequirementsCatBE(data, isDelegated);
      case TestCategory.C1:
      case TestCategory.C:
        return TestReportValidatorProvider.validateLegalRequirementsCNonTrailer(data, isDelegated);
      case TestCategory.C1E:
      case TestCategory.CE:
        return this.validateLegalRequirementsCTrailer(data, isDelegated);
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
        // @TODO - Enable with Home Tests

        // case TestCategory.F:
      // case TestCategory.G:
      // case TestCategory.H:
      // case TestCategory.K:
      //   return this.validateLegalRequirementsCatHomeTest(data);
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
      case TestCategory.BE:
        return this.getMissingLegalRequirementsCatBE(data, isDelegated);
      case TestCategory.C1:
      case TestCategory.C:
        return this.getMissingLegalRequirementsCNonTrailer(data, isDelegated);
      case TestCategory.C1E:
      case TestCategory.CE:
        return this.getMissingLegalRequirementsCTrailer(data, isDelegated);
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
        // @TODO - Enable with Home Tests
        // case TestCategory.F:
      // case TestCategory.G:
      // case TestCategory.H:
      //   return this.getMissingLegalRequirementsCatHomeTest(data);
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
    const avoidanceFirstAttempt = get(data, 'avoidance.firstAttempt');

    const emergencyStopOutcome = get(data, 'singleFaultCompetencies.emergencyStop');
    const avoidanceOutcome = get(data, 'singleFaultCompetencies.avoidance');

    if (emergencyStopNotMet === CompetencyOutcome.S) {
      if (emergencyStopFirstAttempt === undefined) {
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
      if (avoidanceFirstAttempt === undefined) {
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

  private static validateLegalRequirementsCatAdiPart2(data: CatADI2UniqueTypes.TestData): boolean {
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

    !get(data, 'testRequirements.normalStart1', false) && result.push(legalRequirementsLabels.normalStart1);
    !get(data, 'testRequirements.normalStart2', false) && result.push(legalRequirementsLabels.normalStart2);
    !get(data, 'testRequirements.angledStart', false) && result.push(legalRequirementsLabels.angledStart);
    !get(data, 'testRequirements.uphillStart', false) && result.push(legalRequirementsLabels.uphillStart);
    !get(data, 'testRequirements.downhillStart', false) && result.push(legalRequirementsLabels.downhillStart);
    !hasManoeuvreBeenCompletedCatADIPart2(data.manoeuvres) && result.push(legalRequirementsLabels.manoeuvre);
    !hasVehicleChecksBeenCompletedCatADI2(data.vehicleChecks) && result.push(legalRequirementsLabels.vehicleChecks);
    !get(data, 'eco.completed', false) && result.push(legalRequirementsLabels.eco);

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

    !get(data, 'testRequirements.normalStart1', false) && result.push(legalRequirementsLabels.normalStart1);
    !get(data, 'testRequirements.normalStart2', false) && result.push(legalRequirementsLabels.normalStart2);
    !get(data, 'testRequirements.angledStart', false) && result.push(legalRequirementsLabels.angledStart);
    !get(data, 'testRequirements.hillStart', false) && result.push(legalRequirementsLabels.hillStart);
    !hasManoeuvreBeenCompletedCatB(data) && result.push(legalRequirementsLabels.manoeuvre);
    !hasVehicleChecksBeenCompletedCatB(data) && result.push(legalRequirementsLabels.vehicleChecks);
    !get(data, 'eco.completed', false) && result.push(legalRequirementsLabels.eco);

    return result;
  }

  private validateLegalRequirementsCatBE(data: CatBEUniqueTypes.TestData, isDelegated: boolean): boolean {
    const normalStart1: boolean = get(data, 'testRequirements.normalStart1', false);
    const normalStart2: boolean = get(data, 'testRequirements.normalStart2', false);
    const uphillStart: boolean = get(data, 'testRequirements.uphillStart', false);
    const angledStartControlledStop: boolean = get(data, 'testRequirements.angledStartControlledStop', false);
    const manoeuvre: boolean = hasManoeuvreBeenCompletedCatBE(data) || false;
    const eco: boolean = get(data, 'eco.completed', false);
    const uncoupleRecouple: boolean = get(data, 'uncoupleRecouple.selected', false);

    return !isDelegated ? (
      (normalStart1 || normalStart2)
      && uphillStart
      && angledStartControlledStop
      && manoeuvre
      && eco
      && uncoupleRecouple
    ) : (
      angledStartControlledStop
      && manoeuvre
      && eco
    );
  }

  private getMissingLegalRequirementsCatBE(
    data: CatBEUniqueTypes.TestData,
    isDelegated: boolean,
  ): legalRequirementsLabels[] {
    const result: legalRequirementsLabels[] = [];
    if (!isDelegated) {
      !get(data, 'testRequirements.normalStart1', false) && !get(data, 'testRequirements.normalStart2', false)
        && result.push(legalRequirementsLabels.normalStart1);
      !get(data, 'testRequirements.uphillStart', false) && result.push(legalRequirementsLabels.uphillStart);
    }
    !get(data, 'testRequirements.angledStartControlledStop', false)
      && result.push(legalRequirementsLabels.angledStartControlledStop);
    !hasManoeuvreBeenCompletedCatBE(data) && result.push(legalRequirementsLabels.manoeuvre);
    !get(data, 'eco.completed', false) && result.push(legalRequirementsLabels.eco);
    !get(data, 'uncoupleRecouple.selected', false) && result.push(legalRequirementsLabels.uncoupleRecouple);

    return result;
  }

  private static validateLegalRequirementsCNonTrailer(
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
      && manoeuvre
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
      (!get(data, 'testRequirements.normalStart1', false) && !get(data, 'testRequirements.normalStart2', false))
        && result.push(legalRequirementsLabels.normalStart1);
      !get(data, 'testRequirements.uphillStart', false) && result.push(legalRequirementsLabels.uphillStart);
    }
    !get(data, 'testRequirements.angledStartControlledStop', false)
      && result.push(legalRequirementsLabels.angledStartControlledStop);
    !hasManoeuvreBeenCompletedCatC(data) && result.push(legalRequirementsLabels.manoeuvre);
    !get(data, 'eco.completed', false) && result.push(legalRequirementsLabels.eco);

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
    const manoeuvre: boolean = hasManoeuvreBeenCompletedCatC(data) || false;
    const eco: boolean = get(data, 'eco.completed', false);
    const uncoupleRecouple: boolean = get(data, 'uncoupleRecouple.selected', false);

    return !isDelegated ? (
      (normalStart1 || normalStart2)
      && uphillStart
      && angledStartControlledStop
      && manoeuvre
      && eco
      && uncoupleRecouple
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
      (!get(data, 'testRequirements.normalStart1', false) && !get(data, 'testRequirements.normalStart2', false))
        && result.push(legalRequirementsLabels.normalStart1);
      !get(data, 'testRequirements.uphillStart', false) && result.push(legalRequirementsLabels.uphillStart);
    }
    !get(data, 'testRequirements.angledStartControlledStop', false)
    && result.push(legalRequirementsLabels.angledStartControlledStop);
    !hasManoeuvreBeenCompletedCatC(data) && result.push(legalRequirementsLabels.manoeuvre);
    !get(data, 'eco.completed', false) && result.push(legalRequirementsLabels.eco);
    !get(data, 'uncoupleRecouple.selected', false) && result.push(legalRequirementsLabels.uncoupleRecouple);
    return result;
  }

  private validateLegalRequirementsCatD(data: CatDUniqueTypes.TestData, isDelegated: boolean): boolean {
    const busStop1: boolean = get(data, 'testRequirements.busStop1', false);
    const busStop2: boolean = get(data, 'testRequirements.busStop2', false);
    const uphillStart: boolean = get(data, 'testRequirements.uphillStart', false);
    const angledStartControlledStop: boolean = get(data, 'testRequirements.angledStartControlledStop', false);
    const manoeuvre: boolean = get(data, 'manoeuvres.reverseLeft.selected', false);
    const eco: boolean = get(data, 'eco.completed', false);

    return !isDelegated ? (
      busStop1
      && busStop2
      && uphillStart
      && angledStartControlledStop
      && manoeuvre
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
      !get(data, 'testRequirements.busStop1', false)
        && result.push(legalRequirementsLabels.busStop1);
      !get(data, 'testRequirements.busStop2', false)
        && result.push(legalRequirementsLabels.busStop2);
      !get(data, 'testRequirements.uphillStart', false)
        && result.push(legalRequirementsLabels.uphillStart);
    }
    !get(data, 'testRequirements.angledStartControlledStop', false)
      && result.push(legalRequirementsLabels.angledStartControlledStop);
    !get(data, 'manoeuvres.reverseLeft.selected', false)
      && result.push(legalRequirementsLabels.manoeuvre);
    !get(data, 'eco.completed', false)
      && result.push(legalRequirementsLabels.eco);

    return result;
  }

  private validateLegalRequirementsCatD1(data: CatD1UniqueTypes.TestData, isDelegated: boolean): boolean {
    const normalStart1: boolean = get(data, 'testRequirements.normalStart1', false);
    const normalStart2: boolean = get(data, 'testRequirements.normalStart2', false);
    const uphillStart: boolean = get(data, 'testRequirements.uphillStart', false);
    const angledStartControlledStop: boolean = get(data, 'testRequirements.angledStartControlledStop', false);
    const manoeuvre: boolean = get(data, 'manoeuvres.reverseLeft.selected', false);
    const eco: boolean = get(data, 'eco.completed', false);

    return !isDelegated ? (
      normalStart1
      && normalStart2
      && uphillStart
      && angledStartControlledStop
      && manoeuvre
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
      !get(data, 'testRequirements.normalStart1', false)
        && result.push(legalRequirementsLabels.normalStart1);
      !get(data, 'testRequirements.normalStart2', false)
        && result.push(legalRequirementsLabels.normalStart2);
      !get(data, 'testRequirements.uphillStart', false)
        && result.push(legalRequirementsLabels.uphillStart);
    }
    !get(data, 'testRequirements.angledStartControlledStop', false)
      && result.push(legalRequirementsLabels.angledStartControlledStop);
    !get(data, 'manoeuvres.reverseLeft.selected', false)
      && result.push(legalRequirementsLabels.manoeuvre);
    !get(data, 'eco.completed', false)
      && result.push(legalRequirementsLabels.eco);

    return result;
  }

  private validateLegalRequirementsCatDE(data: CatDEUniqueTypes.TestData, isDelegated: boolean): boolean {
    const busStop1: boolean = get(data, 'testRequirements.busStop1', false);
    const busStop2: boolean = get(data, 'testRequirements.busStop2', false);
    const uphillStart: boolean = get(data, 'testRequirements.uphillStart', false);
    const angledStartControlledStop: boolean = get(data, 'testRequirements.angledStartControlledStop', false);
    const manoeuvre: boolean = get(data, 'manoeuvres.reverseLeft.selected', false);
    const eco: boolean = get(data, 'eco.completed', false);
    const uncoupleRecouple = get(data, 'uncoupleRecouple.selected', false);

    return !isDelegated ? (
      busStop1
      && busStop2
      && uphillStart
      && angledStartControlledStop
      && manoeuvre
      && eco
      && uncoupleRecouple
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
      !get(data, 'testRequirements.busStop1', false)
        && result.push(legalRequirementsLabels.busStop1);
      !get(data, 'testRequirements.busStop2', false)
        && result.push(legalRequirementsLabels.busStop2);
      !get(data, 'testRequirements.uphillStart', false)
        && result.push(legalRequirementsLabels.uphillStart);
    }
    !get(data, 'testRequirements.angledStartControlledStop', false)
    && result.push(legalRequirementsLabels.angledStartControlledStop);
    !get(data, 'manoeuvres.reverseLeft.selected', false)
      && result.push(legalRequirementsLabels.manoeuvre);
    !get(data, 'eco.completed', false)
      && result.push(legalRequirementsLabels.eco);
    !get(data, 'uncoupleRecouple.selected', false)
      && result.push(legalRequirementsLabels.uncoupleRecouple);

    return result;
  }

  private validateLegalRequirementsCatD1E(
    data: CatD1EUniqueTypes.TestData,
    isDelegated: boolean,
  ): boolean {
    const normalStart1: boolean = get(data, 'testRequirements.normalStart1', false);
    const normalStart2: boolean = get(data, 'testRequirements.normalStart2', false);
    const uphillStart: boolean = get(data, 'testRequirements.uphillStart', false);
    const angledStartControlledStop: boolean = get(data, 'testRequirements.angledStartControlledStop', false);
    const manoeuvre: boolean = get(data, 'manoeuvres.reverseLeft.selected', false);
    const eco: boolean = get(data, 'eco.completed', false);
    const uncoupleRecouple = get(data, 'uncoupleRecouple.selected', false);

    return !isDelegated ? (
      normalStart1
      && normalStart2
      && uphillStart
      && angledStartControlledStop
      && manoeuvre
      && eco
      && uncoupleRecouple
    ) : (
      angledStartControlledStop
      && manoeuvre
      && eco
      && uncoupleRecouple
    );
  }

  private validateLegalRequirementsCatEUAM2(data: CatAMod2TestData): boolean {
    const normalStart1: boolean = get(data, 'testRequirements.normalStart1', false);
    const normalStart2: boolean = get(data, 'testRequirements.normalStart2', false);
    const angledStart: boolean = get(data, 'testRequirements.angledStart', false);
    const hillStart: boolean = get(data, 'testRequirements.hillStart', false);
    const safteyAndBalanceQuestions: boolean = haveSafetyAndBalanceQuestionsBeenCompleted(data.safetyAndBalanceQuestions);
    const eco: boolean = get(data, 'eco.completed', false);

    return normalStart1 && normalStart2 && angledStart && hillStart && safteyAndBalanceQuestions && eco;
  }

  private getMissingLegalRequirementsCatD1E(
    data: CatD1EUniqueTypes.TestData,
    isDelegated: boolean,
  ): legalRequirementsLabels[] {
    const result: legalRequirementsLabels[] = [];

    if (!isDelegated) {
      !get(data, 'testRequirements.normalStart1', false)
        && result.push(legalRequirementsLabels.normalStart1);
      !get(data, 'testRequirements.normalStart2', false)
        && result.push(legalRequirementsLabels.normalStart2);
      !get(data, 'testRequirements.uphillStart', false)
        && result.push(legalRequirementsLabels.uphillStart);
    }
    !get(data, 'testRequirements.angledStartControlledStop', false)
      && result.push(legalRequirementsLabels.angledStartControlledStop);
    !get(data, 'manoeuvres.reverseLeft.selected', false)
      && result.push(legalRequirementsLabels.manoeuvre);
    !get(data, 'eco.completed', false)
      && result.push(legalRequirementsLabels.eco);
    !get(data, 'uncoupleRecouple.selected', false)
      && result.push(legalRequirementsLabels.uncoupleRecouple);

    return result;
  }

  private getMissingLegalRequirementsCatEUAM2(data: CatAMod2TestData): legalRequirementsLabels[] {
    const result: legalRequirementsLabels[] = [];

    !get(data, 'testRequirements.normalStart1', false) && result.push(legalRequirementsLabels.normalStart1);
    !get(data, 'testRequirements.normalStart2', false) && result.push(legalRequirementsLabels.normalStart2);
    !get(data, 'testRequirements.angledStart', false) && result.push(legalRequirementsLabels.angledStart);
    !get(data, 'testRequirements.hillStart', false) && result.push(legalRequirementsLabels.hillStart);
    !haveSafetyAndBalanceQuestionsBeenCompleted(data.safetyAndBalanceQuestions)
      && result.push(legalRequirementsLabels.safetyAndBalanceQuestions);
    !get(data, 'eco.completed', false) && result.push(legalRequirementsLabels.eco);

    return result;
  }

  // @TODO - Enable with Home Tests
  // private validateLegalRequirementsCatHomeTest(data: HomeTestData): boolean {
  //   const normalStart1: boolean = get(data, 'testRequirements.normalStart1', false);
  //   const normalStart2: boolean = get(data, 'testRequirements.normalStart2', false);
  //   const angledStart: boolean = get(data, 'testRequirements.angledStart', false);
  //   const controlledStop: boolean = get(data, 'controlledStop.selected', false);
  //   const uphillStartDesignatedStart: boolean = get(data, 'testRequirements.uphillStartDesignatedStart', false);
  //
  //   const hCodeSafetyQuestions: boolean = get(data, 'highwayCodeSafety.selected', false);
  //
  //   const eco: boolean = get(data, 'eco.completed', false);
  //
  //   return normalStart1 && normalStart2 && angledStart
  //     && uphillStartDesignatedStart && hCodeSafetyQuestions && eco && controlledStop;
  // }
  //
  // private getMissingLegalRequirementsCatHomeTest(data: HomeTestData): legalRequirementsLabels[] {
  //   const result: legalRequirementsLabels[] = [];
  //
  //   !get(data, 'testRequirements.normalStart1', false) && result.push(legalRequirementsLabels.normalStart1);
  //   !get(data, 'testRequirements.normalStart2', false) && result.push(legalRequirementsLabels.normalStart2);
  //   !get(data, 'testRequirements.angledStart', false) && result.push(legalRequirementsLabels.angledStart);
  //   !get(data, 'testRequirements.uphillStartDesignatedStart', false)
  //     && result.push(legalRequirementsLabels.uphillStartDesignatedStart);
  //
  //   !get(data, 'manoeuvres.reverseLeft.selected', false)
  //     && result.push(legalRequirementsLabels.manoeuvre);
  //
  //   !get(data, 'highwayCodeSafety.selected', false) && result.push(legalRequirementsLabels.highwayCodeSafety);
  //
  //   !get(data, 'eco.completed', false) && result.push(legalRequirementsLabels.eco);
  //
  //   !get(data, 'controlledStop.selected', false) && result.push(legalRequirementsLabels.controlledStop);
  //
  //   return result;
  // }

  private getMissingLegalRequirementsCatK(data: CatKUniqueTypes.TestData): legalRequirementsLabels[] {
    const result: legalRequirementsLabels[] = [];

    !get(data, 'testRequirements.normalStart1', false) && result.push(legalRequirementsLabels.normalStart1);
    !get(data, 'testRequirements.normalStart2', false) && result.push(legalRequirementsLabels.normalStart2);
    !get(data, 'testRequirements.angledStart', false) && result.push(legalRequirementsLabels.angledStart);
    !get(data, 'testRequirements.uphillStartDesignatedStart', false)
      && result.push(legalRequirementsLabels.uphillStartDesignatedStart);

    !get(data, 'highwayCodeSafety.selected', false) && result.push(legalRequirementsLabels.highwayCodeSafety);

    !get(data, 'eco.completed', false) && result.push(legalRequirementsLabels.eco);
    !get(data, 'controlledStop.selected', false) && result.push(legalRequirementsLabels.controlledStop);

    return result;
  }

}

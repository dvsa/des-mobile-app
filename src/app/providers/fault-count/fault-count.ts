import { Injectable } from '@angular/core';

import { VehicleChecks } from '@dvsa/mes-test-schema/categories/ADI2/partial';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { SafetyQuestionsScore } from '@shared/models/safety-questions-score.model';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';

import { TestData } from '@dvsa/mes-test-schema/categories/AM2';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { FaultCountBEHelper } from '@providers/fault-count/cat-be/fault-count.cat-be';
import { sumManoeuvreFaults } from '@shared/helpers/faults';
import { TestOutcome } from '@store/tests/tests.constants';
import { FaultCountBHelper } from './cat-b/fault-count.cat-b';
import { FaultCountCHelper } from './cat-c/fault-count.cat-c';
import { FaultCountDHelper } from './cat-d/fault-count.cat-d';

import { FaultCountAM1Helper } from './cat-a-mod1/fault-count.cat-a-mod1';
import { FaultCountAM2Helper } from './cat-a-mod2/fault-count.cat-a-mod2';
import { FaultCountADIPart2Helper } from './cat-adi-part2/fault-count.cat-adi-part2';
import { FaultCountHomeTestHelper } from './cat-home-test/fault-count.cat-home-test';
import { FaultCountManoeuvreTestHelper } from './cat-manoeuvre/fault-count.cat-manoeuvre';

@Injectable()
export class FaultCountProvider {
	static getFaultSumCountErrMsg = 'Error getting fault sum count';

	public getDrivingFaultSumCount = (category: TestCategory, data: object): number => {
		switch (category) {
			case TestCategory.ADI2:
				return FaultCountADIPart2Helper.getDrivingFaultSumCountCatADIPart2(data);
			case TestCategory.ADI3:
			case TestCategory.SC:
				return 0;
			case TestCategory.BE:
				return FaultCountBEHelper.getDrivingFaultSumCountCatBE(data);
			case TestCategory.B:
				return FaultCountBHelper.getDrivingFaultSumCountCatB(data);
			case TestCategory.C1:
				return FaultCountCHelper.getDrivingFaultSumCountCatC1(data);
			case TestCategory.C1E:
				return FaultCountCHelper.getDrivingFaultSumCountCatC1E(data);
			case TestCategory.CE:
				return FaultCountCHelper.getDrivingFaultSumCountCatCE(data);
			case TestCategory.C:
				return FaultCountCHelper.getDrivingFaultSumCountCatC(data);
			case TestCategory.CM:
			case TestCategory.C1M:
			case TestCategory.CEM:
			case TestCategory.C1EM:
			case TestCategory.DM:
			case TestCategory.D1M:
			case TestCategory.DEM:
			case TestCategory.D1EM:
				return 0; // No driving faults for manoeuvre categories;
			case TestCategory.D1:
				return FaultCountDHelper.getDrivingFaultSumCountCatD1(data);
			case TestCategory.D1E:
				return FaultCountDHelper.getDrivingFaultSumCountCatD1E(data);
			case TestCategory.DE:
				return FaultCountDHelper.getDrivingFaultSumCountCatDE(data);
			case TestCategory.D:
				return FaultCountDHelper.getDrivingFaultSumCountCatD(data);
			case TestCategory.CCPC:
			case TestCategory.DCPC:
				return 0;
			case TestCategory.EUAM1:
			case TestCategory.EUA1M1:
			case TestCategory.EUA2M1:
			case TestCategory.EUAMM1:
				return FaultCountAM1Helper.getRidingFaultSumCountCatAM1(data);
			case TestCategory.EUAM2:
			case TestCategory.EUA1M2:
			case TestCategory.EUA2M2:
			case TestCategory.EUAMM2:
				return FaultCountAM2Helper.getRidingFaultSumCountCatAM2(data);
			case TestCategory.F:
			case TestCategory.G:
			case TestCategory.H:
			case TestCategory.K:
				return FaultCountHomeTestHelper.getDrivingFaultSumCountCatHomeTest(data);
			default:
				throw new Error(`${FaultCountProvider.getFaultSumCountErrMsg}`);
		}
	};

	public getSeriousFaultSumCount = (category: TestCategory, data: object): number => {
		switch (category) {
			case TestCategory.ADI2:
				return FaultCountADIPart2Helper.getSeriousFaultSumCountCatADIPart2(data);
			case TestCategory.ADI3:
			case TestCategory.SC:
				return 0;
			case TestCategory.B:
				return FaultCountBHelper.getSeriousFaultSumCountCatB(data);
			case TestCategory.BE:
				return FaultCountBEHelper.getSeriousFaultSumCountCatBE(data);
			case TestCategory.C1:
				return FaultCountCHelper.getSeriousFaultSumCountCatC1(data);
			case TestCategory.C1E:
				return FaultCountCHelper.getSeriousFaultSumCountCatC1E(data);
			case TestCategory.CE:
				return FaultCountCHelper.getSeriousFaultSumCountCatCE(data);
			case TestCategory.C:
				return FaultCountCHelper.getSeriousFaultSumCountCatC(data);
			case TestCategory.CM:
			case TestCategory.C1M:
			case TestCategory.CEM:
			case TestCategory.C1EM:
			case TestCategory.DM:
			case TestCategory.D1M:
			case TestCategory.DEM:
			case TestCategory.D1EM:
				return FaultCountManoeuvreTestHelper.getSeriousFaultSumCountManoeuvreTest(data);
			case TestCategory.D1:
				return FaultCountDHelper.getSeriousFaultSumCountCatD1(data);
			case TestCategory.D1E:
				return FaultCountDHelper.getSeriousFaultSumCountCatD1E(data);
			case TestCategory.DE:
				return FaultCountDHelper.getSeriousFaultSumCountCatDE(data);
			case TestCategory.D:
				return FaultCountDHelper.getSeriousFaultSumCountCatD(data);
			case TestCategory.CCPC:
			case TestCategory.DCPC:
				return 0;
			case TestCategory.EUAM1:
			case TestCategory.EUA1M1:
			case TestCategory.EUA2M1:
			case TestCategory.EUAMM1:
				return FaultCountAM1Helper.getSeriousFaultSumCountCatAM1(data);
			case TestCategory.EUAM2:
			case TestCategory.EUA1M2:
			case TestCategory.EUA2M2:
			case TestCategory.EUAMM2:
				return FaultCountAM2Helper.getSeriousFaultSumCountCatAM2(data);
			case TestCategory.F:
			case TestCategory.G:
			case TestCategory.H:
			case TestCategory.K:
				return FaultCountHomeTestHelper.getSeriousFaultSumCountHomeTest(data);
			default:
				throw new Error(FaultCountProvider.getFaultSumCountErrMsg);
		}
	};

	public getDangerousFaultSumCount = (category: TestCategory, data: object): number => {
		switch (category) {
			case TestCategory.ADI2:
				return FaultCountADIPart2Helper.getDangerousFaultSumCountCatADIPart2(data);
			case TestCategory.ADI3:
			case TestCategory.SC:
				return 0;
			case TestCategory.B:
				return FaultCountBHelper.getDangerousFaultSumCountCatB(data);
			case TestCategory.BE:
				return FaultCountBEHelper.getDangerousFaultSumCountCatBE(data);
			case TestCategory.C1:
				return FaultCountCHelper.getDangerousFaultSumCountCatC1(data);
			case TestCategory.C1E:
				return FaultCountCHelper.getDangerousFaultSumCountCatC1E(data);
			case TestCategory.CE:
				return FaultCountCHelper.getDangerousFaultSumCountCatCE(data);
			case TestCategory.C:
				return FaultCountCHelper.getDangerousFaultSumCountCatC(data);
			case TestCategory.CM:
			case TestCategory.C1M:
			case TestCategory.CEM:
			case TestCategory.C1EM:
			case TestCategory.DM:
			case TestCategory.D1M:
			case TestCategory.DEM:
			case TestCategory.D1EM:
				return FaultCountManoeuvreTestHelper.getDangerousFaultSumCountManoeuvreTest(data);
			case TestCategory.D1:
				return FaultCountDHelper.getDangerousFaultSumCountCatD1(data);
			case TestCategory.D1E:
				return FaultCountDHelper.getDangerousFaultSumCountCatD1E(data);
			case TestCategory.DE:
				return FaultCountDHelper.getDangerousFaultSumCountCatDE(data);
			case TestCategory.D:
				return FaultCountDHelper.getDangerousFaultSumCountCatD(data);
			case TestCategory.CCPC:
			case TestCategory.DCPC:
				return 0;
			case TestCategory.EUAM1:
			case TestCategory.EUA1M1:
			case TestCategory.EUA2M1:
			case TestCategory.EUAMM1:
				return FaultCountAM1Helper.getDangerousFaultSumCountCatAM1(data);
			case TestCategory.EUAM2:
			case TestCategory.EUA1M2:
			case TestCategory.EUA2M2:
			case TestCategory.EUAMM2:
				return FaultCountAM2Helper.getDangerousFaultSumCountCatAM2(data);
			case TestCategory.F:
			case TestCategory.G:
			case TestCategory.H:
			case TestCategory.K:
				return FaultCountHomeTestHelper.getDangerousFaultSumCountHomeTest(data);
			default:
				throw new Error(FaultCountProvider.getFaultSumCountErrMsg);
		}
	};

	public getManoeuvreFaultCount = <T>(
		category: TestCategory | CategoryCode,
		data: T,
		faultType: CompetencyOutcome
	): number => {
		switch (category) {
			case TestCategory.ADI2:
				if (!Array.isArray(data)) {
					return 0;
				}

				return data.reduce((acc, manoeuvre) => {
					return acc + sumManoeuvreFaults(manoeuvre, faultType);
				}, 0);
			case TestCategory.B:
			case TestCategory.BE:
			case TestCategory.C1:
			case TestCategory.C1E:
			case TestCategory.CE:
			case TestCategory.C:
			case TestCategory.D1:
			case TestCategory.D1E:
			case TestCategory.DE:
			case TestCategory.D:
			case TestCategory.EUAM1:
			case TestCategory.EUA1M1:
			case TestCategory.EUA2M1:
			case TestCategory.EUAMM1:
			case TestCategory.F:
			case TestCategory.G:
			case TestCategory.H:
				return sumManoeuvreFaults(data, faultType);
			case TestCategory.K:
				return 0; // NOTE: no manoeuvres on cat K
			default:
				throw new Error(FaultCountProvider.getFaultSumCountErrMsg);
		}
	};

	public getVehicleChecksFaultCount = (category: TestCategory | CategoryCode, data: object): VehicleChecksScore => {
		switch (category) {
			case TestCategory.ADI2:
				return FaultCountADIPart2Helper.getVehicleChecksFaultCountCatADIPart2(data);
			case TestCategory.BE:
				return FaultCountBEHelper.getVehicleChecksFaultCountCatBE(data);
			case TestCategory.C:
				return FaultCountCHelper.getVehicleChecksFaultCountCatC(data);
			case TestCategory.C1:
				return FaultCountCHelper.getVehicleChecksFaultCountCatC1(data);
			case TestCategory.C1E:
			case TestCategory.CE:
				return FaultCountCHelper.getVehicleChecksFaultCount(data);
			case TestCategory.D:
				return FaultCountDHelper.getVehicleChecksFaultCountCatD(data);
			case TestCategory.D1:
				return FaultCountDHelper.getVehicleChecksFaultCountCatD1(data);
			case TestCategory.D1E:
			case TestCategory.DE:
				return FaultCountDHelper.getVehicleChecksFaultCount(data);
			case TestCategory.F:
			case TestCategory.G:
			case TestCategory.H:
			case TestCategory.K:
				return FaultCountHomeTestHelper.getVehicleChecksFaultCountCatHomeTest(data);
			default:
				throw new Error(FaultCountProvider.getFaultSumCountErrMsg);
		}
	};

	public getSafetyAndBalanceFaultCount = (category: TestCategory, data: object): SafetyQuestionsScore => {
		switch (category) {
			case TestCategory.EUAM2:
			case TestCategory.EUA1M2:
			case TestCategory.EUA2M2:
			case TestCategory.EUAMM2:
				return FaultCountAM2Helper.getSafetyAndBalanceFaultCountCatAM2(data);
			default:
				throw new Error(FaultCountProvider.getFaultSumCountErrMsg);
		}
	};

	public getSafetyQuestionsFaultCount = (category: TestCategory, data: object): SafetyQuestionsScore => {
		switch (category) {
			case TestCategory.D1:
			case TestCategory.D1E:
			case TestCategory.DE:
			case TestCategory.D:
				return FaultCountDHelper.getSafetyQuestionsFaultCount(data);
			default:
				throw new Error(FaultCountProvider.getFaultSumCountErrMsg);
		}
	};

	public getTellMeFaultCount = (category: TestCategory, data: VehicleChecks): VehicleChecksScore => {
		switch (category) {
			case TestCategory.ADI2:
				return FaultCountADIPart2Helper.getTellMeFaultCount(data);
			default:
				throw new Error(FaultCountProvider.getFaultSumCountErrMsg);
		}
	};

	public shouldDisplayDrivingFaultComments = (
		data: TestData,
		category: TestCategory,
		maxFaultCount: number,
		testOutcomeText?: TestOutcome
	): boolean => {
		const drivingFaultCount: number = this.getDrivingFaultSumCount(category, data);
		const seriousFaultCount: number = this.getSeriousFaultSumCount(category, data);
		const dangerousFaultCount: number = this.getDangerousFaultSumCount(category, data);

		if (category === TestCategory.ADI2) {
			return drivingFaultCount > 0 && testOutcomeText === TestOutcome.Failed;
		}

		return dangerousFaultCount === 0 && seriousFaultCount === 0 && drivingFaultCount > maxFaultCount;
	};

	public getShowMeFaultCount = (category: TestCategory, data: VehicleChecks): VehicleChecksScore => {
		switch (category) {
			case TestCategory.ADI2:
				return FaultCountADIPart2Helper.getShowMeFaultCount(data);
			default:
				throw new Error(FaultCountProvider.getFaultSumCountErrMsg);
		}
	};
}

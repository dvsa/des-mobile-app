import { Injectable } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

// list all test categories that are able to be started by the users
export const whiteList: TestCategory[] = [
	TestCategory.ADI2,
	TestCategory.ADI3,
	TestCategory.SC,
	TestCategory.B,
	TestCategory.C,
	TestCategory.C1,
	TestCategory.CE,
	TestCategory.C1E,
	TestCategory.CM,
	TestCategory.C1M,
	TestCategory.CEM,
	TestCategory.C1EM,
	TestCategory.CCPC,
	TestCategory.DCPC,
	TestCategory.D,
	TestCategory.D1,
	TestCategory.D1E,
	TestCategory.DE,
	TestCategory.DM,
	TestCategory.D1M,
	TestCategory.D1EM,
	TestCategory.DEM,
	TestCategory.EUAM1,
	TestCategory.EUA1M1,
	TestCategory.EUA2M1,
	TestCategory.EUAMM1,
	TestCategory.EUAMM2,
	TestCategory.EUA1M2,
	TestCategory.EUA2M2,
	TestCategory.EUAM2,
	TestCategory.F,
	TestCategory.G,
	TestCategory.H,
	TestCategory.K,
];

@Injectable()
export class CategoryWhitelistProvider {
	isWhiteListed(category: TestCategory): boolean {
		return whiteList.some((cat) => cat === category);
	}
}

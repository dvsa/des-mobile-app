import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { behaviourMap as CatBBehaviourMap } from '@pages/office/office-behaviour-map';
import { behaviourMap as CatMod1BehaviourMap } from '@pages/office/office-behaviour-map.cat-a-mod1';
import { behaviourMap as CatMod2BehaviourMap } from '@pages/office/office-behaviour-map.cat-a-mod2';
import { behaviourMap as CatADI2BehaviourMap } from '@pages/office/office-behaviour-map.cat-adi-part2';
import { behaviourMap as CatADI3BehaviourMap } from '@pages/office/office-behaviour-map.cat-adi-part3';
import { behaviourMap as CatCBehaviourMap } from '@pages/office/office-behaviour-map.cat-c';
import { behaviourMap as CatManoeuvreBehaviourMap } from '@pages/office/office-behaviour-map.cat-cm';
import { behaviourMap as CatCPCBehaviourMap } from '@pages/office/office-behaviour-map.cat-cpc';
import { behaviourMap as CatDBehaviourMap } from '@pages/office/office-behaviour-map.cat-d';
import { behaviourMap as CatHomeBehaviourMap } from '@pages/office/office-behaviour-map.cat-home-test';
import { OutcomeBehaviourMapping } from '@providers/outcome-behaviour-map/outcome-behaviour-map.model';

export const getBehaviourMapByCategory = (testCategory: TestCategory): OutcomeBehaviourMapping => {
	switch (testCategory) {
		case TestCategory.ADI2:
			return CatADI2BehaviourMap;
		case TestCategory.ADI3:
		case TestCategory.SC:
			return CatADI3BehaviourMap;
		case TestCategory.B:
			return CatBBehaviourMap;
		case TestCategory.C:
		case TestCategory.C1:
		case TestCategory.CE:
		case TestCategory.C1E:
			return CatCBehaviourMap;
		case TestCategory.CM:
		case TestCategory.C1M:
		case TestCategory.CEM:
		case TestCategory.C1EM:
		case TestCategory.DM:
		case TestCategory.D1M:
		case TestCategory.DEM:
		case TestCategory.D1EM:
			return CatManoeuvreBehaviourMap;
		case TestCategory.D:
		case TestCategory.D1:
		case TestCategory.DE:
		case TestCategory.D1E:
			return CatDBehaviourMap;
		case TestCategory.CCPC:
		case TestCategory.DCPC:
			return CatCPCBehaviourMap;
		case TestCategory.EUAMM1:
		case TestCategory.EUA1M1:
		case TestCategory.EUA2M1:
		case TestCategory.EUAM1:
			return CatMod1BehaviourMap;
		case TestCategory.EUAMM2:
		case TestCategory.EUA1M2:
		case TestCategory.EUA2M2:
		case TestCategory.EUAM2:
			return CatMod2BehaviourMap;
		case TestCategory.F:
		case TestCategory.G:
		case TestCategory.H:
		case TestCategory.K:
			return CatHomeBehaviourMap;
		default:
			console.error(`Missing behaviour map for category: ${testCategory}`);
			return null;
	}
};

import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { OutcomeBehaviourMapping } from '@providers/outcome-behaviour-map/outcome-behaviour-map.model';
import { behaviourMap as CatBBehaviourMap } from '@pages/office/office-behaviour-map';
import { behaviourMap as CatBEBehaviourMap } from '@pages/office/office-behaviour-map.cat-be';
import { behaviourMap as CatCBehaviourMap } from '@pages/office/office-behaviour-map.cat-c';

export const getBehaviourMapByCategory = (testCategory: TestCategory): OutcomeBehaviourMapping => {
  switch (testCategory) {
    case TestCategory.B:
      return CatBBehaviourMap;
    case TestCategory.BE:
      return CatBEBehaviourMap;
    case TestCategory.C:
    case TestCategory.C1:
    case TestCategory.CE:
    case TestCategory.C1E:
      return CatCBehaviourMap;
    default:
      console.error(`Missing behaviour map for category: ${testCategory}`);
      return null;
  }
};

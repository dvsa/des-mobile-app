import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestDataByCategoryProvider } from '../test-data-by-category';

describe('TestDataByCategoryProvider', () => {

  let provider: TestDataByCategoryProvider;

  beforeEach(() => {
    provider = new TestDataByCategoryProvider();
  });

  describe('getTestDataByCategoryCode()', () => {
    const categories = [
      { category: TestCategory.B },
      { category: TestCategory.BE },
      { category: TestCategory.C },
      { category: TestCategory.C1 },
      { category: TestCategory.CE },
      { category: TestCategory.C1E },
      { category: TestCategory.D },
      { category: TestCategory.D1 },
      { category: TestCategory.DE },
      { category: TestCategory.D1E },
      { category: TestCategory.F },
      { category: TestCategory.G },
      { category: TestCategory.H },
      { category: TestCategory.K },
      { category: TestCategory.ADI2 },
    ];

    categories.forEach((cat) => {
      it(`should return ${cat.category} test data for a ${cat.category} Category Code`, () => {
        expect(() => {
          provider.getTestDataByCategoryCode(cat.category);
        }).toEqual(jasmine.any(Function));

        expect(() => {
          provider.getTestDataByCategoryCode(cat.category);
        }).not.toThrowError('Error getting test category');
      });
    });

    it('should throw an error when there is no matching test category', () => {
      expect(() => {
        provider.getTestDataByCategoryCode('z' as TestCategory);
      }).toThrowError('Error getting test category');
    });

    it('should throw an error when test category is undefined', () => {
      expect(() => {
        provider.getTestDataByCategoryCode(undefined);
      }).toThrowError('Error getting test category');
    });
  });
});

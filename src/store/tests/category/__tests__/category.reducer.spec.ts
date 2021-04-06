import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { categoryReducer } from '../category.reducer';
import { PopulateTestCategory } from '../category.actions';

describe('category reducer', () => {
  it('should return the test category for a test', () => {
    const mockTestCategory: CategoryCode = 'B';
    const result = categoryReducer(null, PopulateTestCategory(mockTestCategory));

    expect(result).toBe(mockTestCategory);
  });
});

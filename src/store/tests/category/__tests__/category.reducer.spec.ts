import { categoryReducer } from '../category.reducer';
import { PopulateTestCategory } from '../category.actions';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';

describe('category reducer', () => {
  it('should return the test category for a test', () => {
    const mockTestCategory: CategoryCode = 'B';
    const result = categoryReducer(null, PopulateTestCategory({ payload: mockTestCategory }));

    expect(result).toBe(mockTestCategory);
  });
});

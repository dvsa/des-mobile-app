import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { StartE2EPracticeTest } from '@pages/fake-journal/fake-journal.actions';
import { ActivateTest, StartTest, StartTestReportPracticeTest } from '@store/tests/tests.actions';
import { PopulateTestCategory } from '../category.actions';
import { categoryReducer } from '../category.reducer';

describe('category reducer', () => {
  it('should return the test category for a test', () => {
    const mockTestCategory: CategoryCode = 'B';
    const result = categoryReducer(null, PopulateTestCategory(mockTestCategory));

    expect(result).toBe(mockTestCategory);
  });

  it('should set the category when a test is started', () => {
    expect(categoryReducer(null, StartTest(123, TestCategory.C))).toBe(TestCategory.C);
  });

  it('should set the category when a test report practice test is started', () => {
    expect(categoryReducer(null, StartTestReportPracticeTest('123', TestCategory.B))).toBe(TestCategory.B);
  });

  it('should set the category when an end to end practice test is started', () => {
    expect(categoryReducer(null, StartE2EPracticeTest('123', TestCategory.C))).toBe(TestCategory.C);
  });

  it('should set the category when activating a test with no stored category', () => {
    expect(categoryReducer(null, ActivateTest(123, TestCategory.C))).toBe(TestCategory.C);
  });

  it('should keep the stored category when activating a test', () => {
    expect(categoryReducer(TestCategory.C, ActivateTest(123, TestCategory.CE))).toBe(TestCategory.C);
  });
});

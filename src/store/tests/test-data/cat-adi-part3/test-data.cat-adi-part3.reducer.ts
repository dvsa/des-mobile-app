import { TestData } from '@dvsa/mes-test-schema/categories/ADI3';
import { createFeatureSelector, combineReducers, Action } from '@ngrx/store';
import { lessonAndThemeReducer } from '@store/tests/test-data/cat-adi-part3/lesson-and-theme/lesson-and-theme.reducer';
import { lessonPlanningReducer } from '@store/tests/test-data/cat-adi-part3/lesson-planning/lesson-planning.reducer';
import { riskManagementReducer } from '@store/tests/test-data/cat-adi-part3/risk-management/risk-management.reducer';
import {
  teachingLearningStrategiesReducer,
} from '@store/tests/test-data/cat-adi-part3/teaching-learning-strategies/teaching-learning-strategies.reducer';
import { reviewReducer } from '@store/tests/test-data/cat-adi-part3/review/review.reducer';

export function testDataCatADI3Reducer(
  state: TestData,
  action: Action,
): Required<TestData> {
  return combineReducers({
    lessonAndTheme: lessonAndThemeReducer,
    lessonPlanning: lessonPlanningReducer,
    riskManagement: riskManagementReducer,
    teachingLearningStrategies: teachingLearningStrategiesReducer,
    review: reviewReducer,
  })(state as Required<TestData>, action);
}

export const getTestData = createFeatureSelector<TestData>('testData');

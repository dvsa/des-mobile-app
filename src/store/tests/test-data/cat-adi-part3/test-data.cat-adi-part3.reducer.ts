import { TestData } from '@dvsa/mes-test-schema/categories/ADI3';
import { Action, combineReducers, createFeatureSelector } from '@ngrx/store';
import { endTimeReducer } from '@store/tests/test-data/cat-adi-part3/end-time/end-time.reducer';
import { lessonAndThemeReducer } from '@store/tests/test-data/cat-adi-part3/lesson-and-theme/lesson-and-theme.reducer';
import { lessonPlanningReducer } from '@store/tests/test-data/cat-adi-part3/lesson-planning/lesson-planning.reducer';
import { reviewReducer } from '@store/tests/test-data/cat-adi-part3/review/review.reducer';
import { riskManagementReducer } from '@store/tests/test-data/cat-adi-part3/risk-management/risk-management.reducer';
import { startTimeReducer } from '@store/tests/test-data/cat-adi-part3/start-time/start-time.reducer';
import { teachingLearningStrategiesReducer } from '@store/tests/test-data/cat-adi-part3/teaching-learning-strategies/teaching-learning-strategies.reducer';
import { totalScoreReducer } from '@store/tests/test-data/cat-adi-part3/total-score/total-score.reducer';

export function testDataCatADI3Reducer(state: TestData, action: Action): Required<TestData> {
  return combineReducers({
    lessonAndTheme: lessonAndThemeReducer,
    lessonPlanning: lessonPlanningReducer,
    riskManagement: riskManagementReducer,
    teachingLearningStrategies: teachingLearningStrategiesReducer,
    review: reviewReducer,
    endTime: endTimeReducer,
    startTime: startTimeReducer,
    totalScore: totalScoreReducer,
  })(state as Required<TestData>, action);
}

export const getTestData = createFeatureSelector<TestData>('testData');

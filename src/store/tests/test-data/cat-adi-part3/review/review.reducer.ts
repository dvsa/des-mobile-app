import { Review } from '@dvsa/mes-test-schema/categories/ADI3';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as reviewActions from './review.actions';

export const initialState: Review = {
  immediateDanger: null,
  seekFurtherDevelopment: null,
  feedback: null,
};

export const reviewReducer = createReducer(
  initialState,
  on(reviewActions.ImmediateDangerChanged, (state, { immediateDanger }): Review => ({
    ...state,
    immediateDanger,
  })),
  on(reviewActions.SeekFurtherDevelopmentChanged, (state, { seekFurtherDevelopment }): Review => ({
    ...state,
    seekFurtherDevelopment,
  })),
  on(reviewActions.FeedbackChanged, (state, { feedback }): Review => ({
    ...state,
    feedback,
  })),
);

export const getReview = createFeatureSelector<Review>('review');

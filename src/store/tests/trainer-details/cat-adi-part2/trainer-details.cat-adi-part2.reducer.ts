import * as trainerDetailActions from './trainer-details.cat-adi-part2.actions';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';

const initialState: CatADI2UniqueTypes.TrainerDetails = {
  orditTrainedCandidate: null,
  trainingRecords: null,
  trainerRegistrationNumber: null,
};

export const trainerDetailsCatADIPart2Reducer = createReducer(
  initialState,
  on(trainerDetailActions.OrditTrainedChanged, (state, { payload }): CatADI2UniqueTypes.TrainerDetails => ({
    ...state,
    orditTrainedCandidate: payload,
  })),
  on(trainerDetailActions.TrainingRecordsChanged, (state, { payload }): CatADI2UniqueTypes.TrainerDetails => ({
    ...state,
    trainingRecords: payload,
  })),
  on(trainerDetailActions.TrainerRegistrationNumberChanged, (state, { payload }): CatADI2UniqueTypes.TrainerDetails => ({
    ...state,
    trainerRegistrationNumber: payload,
  })),
);

export const getTrainerDetails = createFeatureSelector<CatADI2UniqueTypes.TrainerDetails>('trainerDetails');

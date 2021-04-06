import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as trainerDetailActions from './trainer-details.cat-adi-part2.actions';

const initialState: CatADI2UniqueTypes.TrainerDetails = {
  orditTrainedCandidate: null,
  trainingRecords: null,
  trainerRegistrationNumber: null,
};

export const trainerDetailsCatADIPart2Reducer = createReducer(
  initialState,
  on(trainerDetailActions.OrditTrainedChanged, (state, {
    orditTrainedCandidate,
  }): CatADI2UniqueTypes.TrainerDetails => ({
    ...state,
    orditTrainedCandidate,
  })),
  on(trainerDetailActions.TrainingRecordsChanged, (state, {
    trainingRecords,
  }): CatADI2UniqueTypes.TrainerDetails => ({
    ...state,
    trainingRecords,
  })),
  on(trainerDetailActions.TrainerRegistrationNumberChanged, (state, {
    trainerRegistrationNumber,
  }): CatADI2UniqueTypes.TrainerDetails => ({
    ...state,
    trainerRegistrationNumber,
  })),
);

export const getTrainerDetails = createFeatureSelector<CatADI2UniqueTypes.TrainerDetails>('trainerDetails');

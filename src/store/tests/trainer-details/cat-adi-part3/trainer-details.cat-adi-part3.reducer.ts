import { TrainerDetails } from '@dvsa/mes-test-schema/categories/ADI3';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as trainerDetailAdi3Actions from './trainer-details.cat-adi-part3.actions';
import * as trainerDetailActions from '../cat-adi-part2/trainer-details.cat-adi-part2.actions';

const initialState: TrainerDetails = {
  orditTrainedCandidate: null,
  trainerRegistrationNumber: null,
  pdiLogbook: null,
  traineeLicence: null,
};

export const trainerDetailsCatADIPart3Reducer = createReducer(
  initialState,
  on(trainerDetailActions.OrditTrainedChanged, (state, { orditTrainedCandidate }): TrainerDetails => ({
    ...state,
    orditTrainedCandidate,
  })),
  on(trainerDetailAdi3Actions.PDILogbook, (state, { pdiLogbook }): TrainerDetails => ({
    ...state,
    pdiLogbook,
  })),
  on(trainerDetailAdi3Actions.TraineeLicence, (state, { traineeLicence }): TrainerDetails => ({
    ...state,
    traineeLicence,
  })),
  on(trainerDetailActions.TrainerRegistrationNumberChanged, (state, {
    trainerRegistrationNumber,
  }): TrainerDetails => ({
    ...state,
    trainerRegistrationNumber,
  })),
);

export const getTrainerDetails = createFeatureSelector<TrainerDetails>('trainerDetails');

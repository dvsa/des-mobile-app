import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { CompetencyOutcome } from 'src/app/shared/models/competency-outcome';
import { ManoeuvreCompetencies, ManoeuvreTypes } from '../../../test-data.constants';
import { manoeuvresReducer } from '../manoeuvres.reducer';
import {
  AddManoeuvreComment,
  AddManoeuvreDangerousFault,
  AddManoeuvreDrivingFault,
  AddManoeuvreSeriousFault,
  RecordManoeuvresSelection,
  RemoveManoeuvreFault,
} from '../../../common/manoeuvres/manoeuvres.actions';

describe('Manoeuvres Reducer', () => {

  describe('RECORD_MANOEUVRES_SELECTION', () => {
    it('should add selected manoeuvre', () => {
      const state: CatBUniqueTypes.Manoeuvres = {};
      const result = manoeuvresReducer(
        state,
        RecordManoeuvresSelection(ManoeuvreTypes.reverseParkRoad),
      );
      expect(result[ManoeuvreTypes.reverseParkRoad]).toEqual({ selected: true });
    });
    it('should replace current with selected manoeuvre', () => {
      const state: CatBUniqueTypes.Manoeuvres = {
        reverseParkCarpark: {
          selected: true,
        },
      };
      const result = manoeuvresReducer(
        state,
        RecordManoeuvresSelection(ManoeuvreTypes.reverseParkRoad),
      );
      expect(result[ManoeuvreTypes.reverseParkRoad]).toEqual({ selected: true });
      expect(result.reverseParkCarpark).toBeUndefined();
    });
    it('should wipe any outcome data from other manoeuvres when changing selected manoeuvre', () => {
      const state: CatBUniqueTypes.Manoeuvres = {
        reverseParkCarpark: {
          selected: true,
          controlFault: 'S',
        },
      };
      const result = manoeuvresReducer(
        state,
        RecordManoeuvresSelection(ManoeuvreTypes.reverseParkRoad),
      );
      expect(result[ManoeuvreTypes.reverseParkRoad]).toBeDefined();
      expect(result[ManoeuvreTypes.reverseParkRoad].selected).toEqual(true);
      expect(result[ManoeuvreTypes.reverseParkCarpark]).toBeUndefined();
    });
  });

  describe('ADD_MANOEUVRE_DRIVING_FAULT', () => {
    it('should add a "DF" outcome to the selected manoeuvre', () => {
      const state: CatBUniqueTypes.Manoeuvres = {
        reverseParkRoad: { selected: true },
      };
      const result = manoeuvresReducer(
        state,
        AddManoeuvreDrivingFault({
          manoeuvre: ManoeuvreTypes.reverseParkRoad,
          competency: ManoeuvreCompetencies.controlFault,
        }),
      );
      expect(result.reverseParkRoad.controlFault).toEqual(CompetencyOutcome.DF);
    });
  });

  describe('ADD_MANOEUVRE_SERIOUS_FAULT', () => {
    it('should add a "S" outcome to the selected manoeuvre', () => {
      const state: CatBUniqueTypes.Manoeuvres = {
        reverseParkRoad: { selected: true },
      };
      const result = manoeuvresReducer(
        state,
        AddManoeuvreSeriousFault({
          manoeuvre: ManoeuvreTypes.reverseParkRoad,
          competency: ManoeuvreCompetencies.controlFault,
        }),
      );
      expect(result.reverseParkRoad.controlFault).toEqual(CompetencyOutcome.S);
    });
  });

  describe('ADD_MANOEUVRE_DANGEROUS_FAULT', () => {
    it('should add a "D" outcome to the selected manoeuvre', () => {
      const state: CatBUniqueTypes.Manoeuvres = {
        reverseParkRoad: { selected: true },
      };
      const result = manoeuvresReducer(
        state,
        AddManoeuvreDangerousFault({
          manoeuvre: ManoeuvreTypes.reverseParkRoad,
          competency: ManoeuvreCompetencies.controlFault,
        }),
      );
      expect(result.reverseParkRoad.controlFault).toEqual(CompetencyOutcome.D);
    });
  });

  describe('ADD_MANOEUVRE_COMMENT', () => {
    it('should add a comment to the selected Manoeuvre', () => {
      const state: CatBUniqueTypes.Manoeuvres = {
        reverseParkRoad: { selected: true },
      };
      const result = manoeuvresReducer(
        state,
        AddManoeuvreComment(
          ManoeuvreTypes.reverseParkRoad,
          CompetencyOutcome.S,
          'control',
          'comments',
        ),
      );
      expect(result.reverseParkRoad.controlFaultComments).toEqual('comments');
    });
  });

  describe('REMOVE_MANOEUVRE_FAULT', () => {
    it('should remove the fault from a manoeuvre', () => {
      const state: CatBUniqueTypes.Manoeuvres = {
        reverseParkRoad: { selected: true, controlFault: CompetencyOutcome.DF },
      };
      const result = manoeuvresReducer(state, RemoveManoeuvreFault({
        competency: ManoeuvreCompetencies.controlFault,
        manoeuvre: ManoeuvreTypes.reverseParkRoad,
      }, CompetencyOutcome.DF));
      expect(result.reverseParkRoad.controlFault).toBeUndefined();
    });
  });
});

import { CompetencyOutcome } from 'src/app/shared/models/competency-outcome';
import {
  manoeuvresCatManoeuvreReducer,
} from '@store/tests/test-data/cat-manoeuvres/manoeuvres/manoeuvres.cat-cm.reducer';
import { CatCMUniqueTypes } from '@dvsa/mes-test-schema/categories/CM';
import { CatCEMUniqueTypes } from '@dvsa/mes-test-schema/categories/CEM';
import { CatC1MUniqueTypes } from '@dvsa/mes-test-schema/categories/C1M';
import { CatC1EMUniqueTypes } from '@dvsa/mes-test-schema/categories/C1EM';
import {
  RecordManoeuvresSelection,
  AddManoeuvreDrivingFault,
  AddManoeuvreSeriousFault,
  AddManoeuvreDangerousFault,
  AddManoeuvreComment,
  RemoveManoeuvreFault,
} from '../../../common/manoeuvres/manoeuvres.actions';
import { ManoeuvreTypes, ManoeuvreCompetencies } from '../../../test-data.constants';

describe('Test Data Cat Manoeuvres Reducer', () => {

  describe('RECORD_MANOEUVRES_SELECTION', () => {
    it('should add selected manoeuvre', () => {
      const state: CatCMUniqueTypes.Manoeuvres |
      CatCEMUniqueTypes.Manoeuvres |
      CatC1MUniqueTypes.Manoeuvres |
      CatC1EMUniqueTypes.Manoeuvres = {};
      const result = manoeuvresCatManoeuvreReducer(
        state,
        RecordManoeuvresSelection(ManoeuvreTypes.reverseParkRoad),
      );
      expect(result[ManoeuvreTypes.reverseParkRoad]).toEqual({ selected: true });
    });
    it('should replace current with selected manoeuvre', () => {
      const state: CatCMUniqueTypes.Manoeuvres |
      CatCEMUniqueTypes.Manoeuvres |
      CatC1MUniqueTypes.Manoeuvres |
      CatC1EMUniqueTypes.Manoeuvres = {
        reverseManoeuvre: {
          selected: true,
        },
      };
      const result = manoeuvresCatManoeuvreReducer(
        state,
        RecordManoeuvresSelection(ManoeuvreTypes.reverseParkRoad),
      );
      expect(result[ManoeuvreTypes.reverseParkRoad]).toEqual({ selected: true });
      expect(result.reverseManoeuvre).toBeUndefined();
    });

    it('should wipe any outcome data from other manoeuvres when changing selected manoeuvre', () => {
      const state: CatCMUniqueTypes.Manoeuvres |
      CatCEMUniqueTypes.Manoeuvres |
      CatC1MUniqueTypes.Manoeuvres |
      CatC1EMUniqueTypes.Manoeuvres = {
        reverseManoeuvre: {
          selected: true,
          controlFault: 'S',
        },
      };
      const result = manoeuvresCatManoeuvreReducer(
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
      const state: CatCMUniqueTypes.Manoeuvres |
      CatCEMUniqueTypes.Manoeuvres |
      CatC1MUniqueTypes.Manoeuvres |
      CatC1EMUniqueTypes.Manoeuvres = {
        reverseManoeuvre: {
          selected: true,
        },
      };
      const result = manoeuvresCatManoeuvreReducer(
        state,
        AddManoeuvreDrivingFault({
          manoeuvre: ManoeuvreTypes.reverseParkRoad,
          competency: ManoeuvreCompetencies.controlFault,
        }),
      );
      expect(result[ManoeuvreTypes.reverseParkRoad].controlFault).toEqual(CompetencyOutcome.DF);
    });
  });

  describe('ADD_MANOEUVRE_SERIOUS_FAULT', () => {
    it('should add a "S" outcome to the selected manoeuvre', () => {
      const state: CatCMUniqueTypes.Manoeuvres |
      CatCEMUniqueTypes.Manoeuvres |
      CatC1MUniqueTypes.Manoeuvres |
      CatC1EMUniqueTypes.Manoeuvres = {
        reverseManoeuvre: {
          selected: true,
        },
      };
      const result = manoeuvresCatManoeuvreReducer(
        state,
        AddManoeuvreSeriousFault({
          manoeuvre: ManoeuvreTypes.reverseParkRoad,
          competency: ManoeuvreCompetencies.controlFault,
        }),
      );
      expect(result[ManoeuvreTypes.reverseParkRoad].controlFault).toEqual(CompetencyOutcome.S);
    });
  });

  describe('ADD_MANOEUVRE_DANGEROUS_FAULT', () => {
    it('should add a "D" outcome to the selected manoeuvre', () => {
      const state: CatCMUniqueTypes.Manoeuvres |
      CatCEMUniqueTypes.Manoeuvres |
      CatC1MUniqueTypes.Manoeuvres |
      CatC1EMUniqueTypes.Manoeuvres = {
        reverseManoeuvre: {
          selected: true,
        },
      };
      const result = manoeuvresCatManoeuvreReducer(
        state,
        AddManoeuvreDangerousFault({
          manoeuvre: ManoeuvreTypes.reverseParkRoad,
          competency: ManoeuvreCompetencies.controlFault,
        }),
      );
      expect(result[ManoeuvreTypes.reverseParkRoad].controlFault).toEqual(CompetencyOutcome.D);
    });
  });

  describe('ADD_MANOEUVRE_COMMENT', () => {
    it('should add a comment to the selected Manoeuvre', () => {
      const state: CatCMUniqueTypes.Manoeuvres |
      CatCEMUniqueTypes.Manoeuvres |
      CatC1MUniqueTypes.Manoeuvres |
      CatC1EMUniqueTypes.Manoeuvres = {
        reverseManoeuvre: {
          selected: true,
        },
      };
      const result = manoeuvresCatManoeuvreReducer(
        state,
        AddManoeuvreComment(
          ManoeuvreTypes.reverseParkRoad,
          CompetencyOutcome.S,
          'control',
          'comments',
        ),
      );
      expect(result[ManoeuvreTypes.reverseParkRoad].controlFaultComments).toEqual('comments');
    });
  });

  describe('REMOVE_MANOEUVRE_FAULT', () => {
    it('should remove the fault from a manoeuvre', () => {
      const state: CatCMUniqueTypes.Manoeuvres |
      CatCEMUniqueTypes.Manoeuvres |
      CatC1MUniqueTypes.Manoeuvres |
      CatC1EMUniqueTypes.Manoeuvres = {
        reverseManoeuvre: {
          selected: true,
          controlFault: CompetencyOutcome.DF,
        },
      };
      const result = manoeuvresCatManoeuvreReducer(state, RemoveManoeuvreFault({
        competency: ManoeuvreCompetencies.controlFault,
        manoeuvre: ManoeuvreTypes.reverseManoeuvre,
      }));
      expect(result[ManoeuvreTypes.reverseManoeuvre].controlFault).toBeUndefined();
    });
  });
});

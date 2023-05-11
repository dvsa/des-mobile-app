import { CompetencyOutcome } from 'src/app/shared/models/competency-outcome';
import {
  manoeuvresCatManoeuvreReducer,
} from '@store/tests/test-data/cat-manoeuvres/manoeuvres/manoeuvres.cat-cm.reducer';
import { CatCMUniqueTypes } from '@dvsa/mes-test-schema/categories/CM';
import { CatCEMUniqueTypes } from '@dvsa/mes-test-schema/categories/CEM';
import { CatC1MUniqueTypes } from '@dvsa/mes-test-schema/categories/C1M';
import { CatC1EMUniqueTypes } from '@dvsa/mes-test-schema/categories/C1EM';
import {
  AddManoeuvreComment,
  AddManoeuvreDangerousFault,
  AddManoeuvreSeriousFault,
  RecordManoeuvresSelection,
  RemoveManoeuvreFault,
} from '../../../common/manoeuvres/manoeuvres.actions';
import { ManoeuvreCompetencies, ManoeuvreTypes } from '../../../test-data.constants';

describe('manoeuvresCatManoeuvreReducer', () => {
  describe('RECORD_MANOEUVRES_SELECTION', () => {
    it('should add selected manoeuvre', () => {
      const state: CatCMUniqueTypes.Manoeuvres |
      CatCEMUniqueTypes.Manoeuvres |
      CatC1MUniqueTypes.Manoeuvres |
      CatC1EMUniqueTypes.Manoeuvres = {
        reverseManoeuvre: {
          selected: false,
        },
      };
      const result = manoeuvresCatManoeuvreReducer(
        state,
        RecordManoeuvresSelection(ManoeuvreTypes.reverseManoeuvre),
      );
      expect(result[ManoeuvreTypes.reverseManoeuvre]).toEqual({ selected: true });
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
          manoeuvre: ManoeuvreTypes.reverseManoeuvre,
          competency: ManoeuvreCompetencies.controlFault,
        }),
      );
      expect(result[ManoeuvreTypes.reverseManoeuvre].controlFault).toEqual(CompetencyOutcome.S);
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
          manoeuvre: ManoeuvreTypes.reverseManoeuvre,
          competency: ManoeuvreCompetencies.controlFault,
        }),
      );
      expect(result[ManoeuvreTypes.reverseManoeuvre].controlFault).toEqual(CompetencyOutcome.D);
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
          ManoeuvreTypes.reverseManoeuvre,
          CompetencyOutcome.S,
          'control',
          'comments',
        ),
      );
      expect(result[ManoeuvreTypes.reverseManoeuvre].controlFaultComments).toEqual('comments');
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
      }, CompetencyOutcome.DF));
      expect(result[ManoeuvreTypes.reverseManoeuvre].controlFault).toBeUndefined();
    });
  });
});

import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { ManoeuvreTypes, ManoeuvreCompetencies } from '../../../test-data.constants';
import { manoeuvresCatADI2Reducer } from '../manoeuvres.reducer';
import {
  RecordManoeuvresSelection,
  AddManoeuvreDrivingFault,
  AddManoeuvreSeriousFault,
  AddManoeuvreDangerousFault,
  AddManoeuvreComment,
  RemoveManoeuvreFault,
} from '../manoeuvres.actions';
import { CompetencyOutcome } from '../../../../../../shared/models/competency-outcome';

describe('ADI2 Manoeuvres Reducer', () => {

  describe('RECORD_MANOEUVRES_SELECTION', () => {
    it('should add selected manoeuvre at position 1', () => {
      const state: CatADI2UniqueTypes.Manoeuvres[] = [{}, {}];
      const result = manoeuvresCatADI2Reducer(
        state,
        new RecordManoeuvresSelection(ManoeuvreTypes.reverseParkRoad, 0),
      );
      expect(result[0][ManoeuvreTypes.reverseParkRoad]).toEqual({ selected: true });
    });

    it('should add selected manoeuvre at position 2', () => {
      const state: CatADI2UniqueTypes.Manoeuvres[] = [{}, {}];
      const result = manoeuvresCatADI2Reducer(
        state,
        new RecordManoeuvresSelection(ManoeuvreTypes.reverseParkRoad, 1),
      );
      expect(result[1][ManoeuvreTypes.reverseParkRoad]).toEqual({ selected: true });
    });

    it('should replace current with selected manoeuvre at position 1', () => {
      const state: CatADI2UniqueTypes.Manoeuvres[] = [{
        reverseParkCarpark: {
          selected: true,
        },
      }, {}];
      const result = manoeuvresCatADI2Reducer(
        state,
        new RecordManoeuvresSelection(ManoeuvreTypes.reverseParkRoad, 0),
      );
      expect(result[0][ManoeuvreTypes.reverseParkRoad]).toEqual({ selected: true });
      expect(result[0].reverseParkCarpark).toBeUndefined();
    });

    it('should replace current with selected manoeuvre at position 2', () => {
      const state: CatADI2UniqueTypes.Manoeuvres[] = [{}, {
        reverseParkCarpark: {
          selected: true,
        },
      }];
      const result = manoeuvresCatADI2Reducer(
        state,
        new RecordManoeuvresSelection(ManoeuvreTypes.reverseParkRoad, 1),
      );
      expect(result[1][ManoeuvreTypes.reverseParkRoad]).toEqual({ selected: true });
      expect(result[1].reverseParkCarpark).toBeUndefined();
    });

    it('should wipe any outcome data from other manoeuvres when changing selected manoeuvre', () => {
      const state: CatADI2UniqueTypes.Manoeuvres[] = [{
        reverseParkCarpark: {
          selected: true,
          controlFault: 'S',
        },
      }, {}];
      const result = manoeuvresCatADI2Reducer(
        state,
        new RecordManoeuvresSelection(ManoeuvreTypes.reverseParkRoad, 0),
      );
      expect(result[0][ManoeuvreTypes.reverseParkRoad]).toBeDefined();
      expect(result[0][ManoeuvreTypes.reverseParkRoad].selected).toEqual(true);
      expect(result[0][ManoeuvreTypes.reverseParkCarpark]).toBeUndefined();
    });
  });

  describe('ADD_MANOEUVRE_DRIVING_FAULT', () => {
    it('should add a "DF" outcome to the selected manoeuvre at position 1', () => {
      const state: CatADI2UniqueTypes.Manoeuvres[] = [{
        reverseParkRoad: { selected: true },
      }, {
        reverseParkCarpark: { selected: true },
      }];
      const result = manoeuvresCatADI2Reducer(
        state,
        new AddManoeuvreDrivingFault({
          manoeuvre: ManoeuvreTypes.reverseParkRoad,
          competency: ManoeuvreCompetencies.controlFault,
        }, 0),
      );
      expect(result[0].reverseParkRoad.controlFault).toEqual(CompetencyOutcome.DF);
      expect(result[1].reverseParkCarpark.controlFault).toBeUndefined();
    });

    it('should add a "DF" outcome to the selected manoeuvre at position 2', () => {
      const state: CatADI2UniqueTypes.Manoeuvres[] = [{
        reverseParkRoad: { selected: true },
      }, {
        reverseParkCarpark: { selected: true },
      }];
      const result = manoeuvresCatADI2Reducer(
        state,
        new AddManoeuvreDrivingFault({
          manoeuvre: ManoeuvreTypes.reverseParkCarpark,
          competency: ManoeuvreCompetencies.controlFault,
        }, 1),
      );
      expect(result[0].reverseParkRoad.controlFault).toBeUndefined();
      expect(result[1].reverseParkCarpark.controlFault).toEqual(CompetencyOutcome.DF);
    });
  });

  describe('ADD_MANOEUVRE_SERIOUS_FAULT', () => {
    it('should add a "S" outcome to the selected manoeuvre at position 1', () => {
      const state: CatADI2UniqueTypes.Manoeuvres[] = [{
        reverseParkRoad: { selected: true },
      }, {
        reverseParkCarpark: { selected: true },
      }];
      const result = manoeuvresCatADI2Reducer(
        state,
        new AddManoeuvreSeriousFault({
          manoeuvre: ManoeuvreTypes.reverseParkRoad,
          competency: ManoeuvreCompetencies.controlFault,
        }, 0),
      );
      expect(result[0].reverseParkRoad.controlFault).toEqual(CompetencyOutcome.S);
      expect(result[1].reverseParkCarpark.controlFault).toBeUndefined();
    });

    it('should add a "S" outcome to the selected manoeuvre at position 2', () => {
      const state: CatADI2UniqueTypes.Manoeuvres[] = [{
        reverseParkRoad: { selected: true },
      }, {
        reverseParkCarpark: { selected: true },
      }];
      const result = manoeuvresCatADI2Reducer(
        state,
        new AddManoeuvreSeriousFault({
          manoeuvre: ManoeuvreTypes.reverseParkCarpark,
          competency: ManoeuvreCompetencies.controlFault,
        }, 1),
      );
      expect(result[0].reverseParkRoad.controlFault).toBeUndefined();
      expect(result[1].reverseParkCarpark.controlFault).toEqual(CompetencyOutcome.S);
    });
  });

  describe('ADD_MANOEUVRE_DANGEROUS_FAULT', () => {
    it('should add a "D" outcome to the selected manoeuvre at position 1', () => {
      const state: CatADI2UniqueTypes.Manoeuvres[] = [{
        reverseParkRoad: { selected: true },
      }, {
        reverseParkCarpark: { selected: true },
      }];
      const result = manoeuvresCatADI2Reducer(
        state,
        new AddManoeuvreDangerousFault({
          manoeuvre: ManoeuvreTypes.reverseParkRoad,
          competency: ManoeuvreCompetencies.controlFault,
        }, 0),
      );
      expect(result[0].reverseParkRoad.controlFault).toEqual(CompetencyOutcome.D);
      expect(result[1].reverseParkCarpark.controlFault).toBeUndefined();
    });

    it('should add a "D" outcome to the selected manoeuvre at position 2', () => {
      const state: CatADI2UniqueTypes.Manoeuvres[] = [{
        reverseParkRoad: { selected: true },
      }, {
        reverseParkCarpark: { selected: true },
      }];
      const result = manoeuvresCatADI2Reducer(
        state,
        new AddManoeuvreDangerousFault({
          manoeuvre: ManoeuvreTypes.reverseParkCarpark,
          competency: ManoeuvreCompetencies.controlFault,
        }, 1),
      );
      expect(result[0].reverseParkRoad.controlFault).toBeUndefined();
      expect(result[1].reverseParkCarpark.controlFault).toEqual(CompetencyOutcome.D);
    });
  });

  describe('ADD_MANOEUVRE_COMMENT', () => {
    it('should add a comment to the selected Manoeuvre', () => {
      const state: CatADI2UniqueTypes.Manoeuvres[] = [{
        reverseParkRoad: { selected: true },
      }, {}];
      const result = manoeuvresCatADI2Reducer(
        state,
        new AddManoeuvreComment(
          ManoeuvreTypes.reverseParkRoad,
          CompetencyOutcome.S,
          'control',
          'comments',
          0,
        ),
      );
      expect(result[0].reverseParkRoad.controlFaultComments).toEqual('comments');
    });
  });

  describe('REMOVE_MANOEUVRE_FAULT', () => {
    it('should remove the fault from a manoeuvre at position 1', () => {
      const state: CatADI2UniqueTypes.Manoeuvres[] = [{
        reverseParkRoad: { selected: true, controlFault: CompetencyOutcome.DF },
      }, {
        reverseParkCarpark: { selected: true, controlFault: CompetencyOutcome.DF },
      }];
      const result = manoeuvresCatADI2Reducer(state, new RemoveManoeuvreFault({
        competency: ManoeuvreCompetencies.controlFault,
        manoeuvre: ManoeuvreTypes.reverseParkRoad,
      }, 0));
      expect(result[0].reverseParkRoad.controlFault).toBeUndefined();
      expect(result[1].reverseParkCarpark.controlFault).toEqual(CompetencyOutcome.DF);
    });

    it('should remove the fault from a manoeuvre at position 2', () => {
      const state: CatADI2UniqueTypes.Manoeuvres[] = [{
        reverseParkRoad: { selected: true, controlFault: CompetencyOutcome.DF },
      }, {
        reverseParkCarpark: { selected: true, controlFault: CompetencyOutcome.DF },
      }];
      const result = manoeuvresCatADI2Reducer(state, new RemoveManoeuvreFault({
        competency: ManoeuvreCompetencies.controlFault,
        manoeuvre: ManoeuvreTypes.reverseParkCarpark,
      }, 1));
      expect(result[0].reverseParkRoad.controlFault).toEqual(CompetencyOutcome.DF);
      expect(result[1].reverseParkCarpark.controlFault).toBeUndefined();
    });
  });
});

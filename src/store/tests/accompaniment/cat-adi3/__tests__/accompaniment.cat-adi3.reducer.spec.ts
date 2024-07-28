import { Accompaniment } from '@dvsa/mes-test-schema/categories/ADI3';
import { accompanimentCatADI3Reducer } from '@store/tests/accompaniment/cat-adi3/accompaniment.cat-adi3.reducer';
import * as accompanimentActions from '../../accompaniment.actions';
import * as accompanimentADI3Actions from '../accompaniment.cat-adi3.actions';

describe('accompanimentCatADI3Reducer', () => {
  describe('SupervisorAccompanimentToggled', () => {
    it('should toggle state.supervisor when called', () => {
      let result: Accompaniment = { supervisor: true };
      result = accompanimentCatADI3Reducer(result, accompanimentActions.SupervisorAccompanimentToggled());
      expect(result).toEqual({ supervisor: false });
    });
  });
  describe('InterpreterAccompanimentToggledCPC', () => {
    it('should toggle state.supervisor when called', () => {
      let result: Accompaniment = { other: true };
      result = accompanimentCatADI3Reducer(result, accompanimentActions.OtherAccompanimentToggled());
      expect(result).toEqual({ other: false });
    });
  });
  describe('InterpreterAccompanimentToggledCPC', () => {
    it('should toggle state.supervisor when called', () => {
      let result: Accompaniment = { trainer: true };
      result = accompanimentCatADI3Reducer(result, accompanimentADI3Actions.TrainerAccompanimentToggled());
      expect(result).toEqual({ trainer: false });
    });
  });
});

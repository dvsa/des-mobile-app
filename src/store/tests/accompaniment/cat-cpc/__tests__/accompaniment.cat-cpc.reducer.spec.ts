import { Accompaniment } from '@dvsa/mes-test-schema/categories/common';
import { accompanimentCatCPCReducer } from '@store/tests/accompaniment/cat-cpc/accompaniment.cat-cpc.reducer';
import * as accompanimentActions from '../accompaniment.cat-cpc.actions';

describe('accompanimentCatCPCReducer',
  () => {
    describe('SupervisorAccompanimentToggledCPC', () => {
      it('should toggle state.supervisor when called', () => {
        let result: Accompaniment = { supervisor: true };
        result = accompanimentCatCPCReducer(result, accompanimentActions.SupervisorAccompanimentToggledCPC());
        expect(result).toEqual({ supervisor: false });
      });
    });
    describe('InterpreterAccompanimentToggledCPC', () => {
      it('should toggle state.supervisor when called', () => {
        let result: Accompaniment = { interpreter: true };
        result = accompanimentCatCPCReducer(result, accompanimentActions.InterpreterAccompanimentToggledCPC());
        expect(result).toEqual({ interpreter: false });
      });
    });
  });

import { accompanimentReducer } from '../accompaniment.reducer';
import {
  InstructorAccompanimentToggled,
  SupervisorAccompanimentToggled,
  OtherAccompanimentToggled,
  InterpreterAccompanimentToggled,
} from '../accompaniment.actions';

describe('accompaniment reducer', () => {

  it('should toggle ADI accompaniment when receiving the instructor toggle action', () => {
    let result;
    result = accompanimentReducer({}, InstructorAccompanimentToggled());
    expect(result.ADI).toBe(true);
    result = accompanimentReducer(result, InstructorAccompanimentToggled());
    expect(result.ADI).toBe(false);
  });

  it('should toggle supervisor accompaniment when receiving the supervisor toggle action', () => {
    let result;
    result = accompanimentReducer({}, SupervisorAccompanimentToggled());
    expect(result.supervisor).toBe(true);
    result = accompanimentReducer(result, SupervisorAccompanimentToggled());
    expect(result.supervisor).toBe(false);
  });

  it('should toggle other accompaniment when receiving the other toggle action', () => {
    let result;
    result = accompanimentReducer({}, OtherAccompanimentToggled());
    expect(result.other).toBe(true);
    result = accompanimentReducer(result, OtherAccompanimentToggled());
    expect(result.other).toBe(false);
  });

  it('should toggle interpreter accompaniment when receiving the interpreter toggle action', () => {
    let result;
    result = accompanimentReducer({}, InterpreterAccompanimentToggled());
    expect(result.interpreter).toBe(true);
    result = accompanimentReducer(result, InterpreterAccompanimentToggled());
    expect(result.interpreter).toBe(false);
  });

});

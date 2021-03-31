
import { UncoupleRecouple, uncoupleRecoupleReducer } from '../uncouple-recouple.reducer';
import {
  ToggleUncoupleRecouple,
  UncoupleRecoupleAddDrivingFault,
  UncoupleRecoupleAddSeriousFault,
  UncoupleRecoupleAddDangerousFault,
  UncoupleRecoupleRemoveFault,
  AddUncoupleRecoupleComment,
} from '../../../common/uncouple-recouple/uncouple-recouple.actions';
import { CompetencyOutcome } from '../../../../../../shared/models/competency-outcome';

describe('uncoupleRecoupleReducer' , () => {

  describe('TOGGLE_UNCOUPLE_RECOUPLE', () => {
    it('should toggle the uncouple recouple (true when dispatched first time)', () => {
      const state: UncoupleRecouple = {};
      const result = uncoupleRecoupleReducer(state, new ToggleUncoupleRecouple());
      expect(result.selected).toEqual(true);
    });
    it('should remove the uncouple recouple property when dispatched second time', () => {
      const state: UncoupleRecouple = {};
      const modifiedState = uncoupleRecoupleReducer(state, new ToggleUncoupleRecouple());
      const result = uncoupleRecoupleReducer(modifiedState, new ToggleUncoupleRecouple());
      expect(result.selected).toEqual(false);
    });
  });

  describe('UNCOUPLE_RECOUPLE_ADD_DRIVING_FAULT', () => {
    it('should add the correct fault', () => {
      const state: UncoupleRecouple = {};
      const result = uncoupleRecoupleReducer(state, new UncoupleRecoupleAddDrivingFault());
      expect(result.selected).toEqual(true);
      expect(result.fault).toEqual(CompetencyOutcome.DF);
    });
  });

  describe('UNCOUPLE_RECOUPLE_ADD_SERIOUS_FAULT', () => {
    it('should add the correct fault', () => {
      const state: UncoupleRecouple = {};
      const result = uncoupleRecoupleReducer(state, new UncoupleRecoupleAddSeriousFault());
      expect(result.selected).toEqual(true);
      expect(result.fault).toEqual(CompetencyOutcome.S);
    });
  });

  describe('UNCOUPLE_RECOUPLE_ADD_DANGEROUS_FAULT', () => {
    it('should add the correct fault', () => {
      const state: UncoupleRecouple = {};
      const result = uncoupleRecoupleReducer(state, new UncoupleRecoupleAddDangerousFault());
      expect(result.selected).toEqual(true);
      expect(result.fault).toEqual(CompetencyOutcome.D);
    });
  });

  describe('UNCOUPLE_RECOUPLE_REMOVE_FAULT', () => {
    it('should remove the fault', () => {
      const state: UncoupleRecouple = {};
      const modifiedState = uncoupleRecoupleReducer(state, new UncoupleRecoupleAddDangerousFault());
      const result = uncoupleRecoupleReducer(modifiedState, new UncoupleRecoupleRemoveFault());
      expect(result.selected).toEqual(true);
      expect(result.fault).toBeUndefined();
      expect(result.faultComments).toBeUndefined();
    });
  });

  describe('ADD_UNCOUPLE_RECOUPLE_COMMENT', () => {
    it('should add a fault comment', () => {
      const state: UncoupleRecouple = {};
      const result = uncoupleRecoupleReducer(state, new AddUncoupleRecoupleComment('Test'));
      expect(result.faultComments).toEqual('Test');
    });
  });
});

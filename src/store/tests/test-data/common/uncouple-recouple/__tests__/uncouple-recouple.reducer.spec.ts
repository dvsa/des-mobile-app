import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { UncoupleRecouple, uncoupleRecoupleReducer } from '../uncouple-recouple.reducer';
import {
  ToggleUncoupleRecouple,
  UncoupleRecoupleAddDrivingFault,
  UncoupleRecoupleAddSeriousFault,
  UncoupleRecoupleAddDangerousFault,
  UncoupleRecoupleRemoveFault,
  AddUncoupleRecoupleComment,
} from '../uncouple-recouple.actions';

describe('uncoupleRecoupleReducer', () => {

  describe('TOGGLE_UNCOUPLE_RECOUPLE', () => {
    it('should toggle the uncouple recouple (true when dispatched first time)', () => {
      const state: UncoupleRecouple = {};
      const result = uncoupleRecoupleReducer(state, ToggleUncoupleRecouple());
      expect(result.selected).toEqual(true);
    });
    it('should remove the uncouple recouple property when dispatched second time', () => {
      const state: UncoupleRecouple = {};
      const modifiedState = uncoupleRecoupleReducer(state, ToggleUncoupleRecouple());
      const result = uncoupleRecoupleReducer(modifiedState, ToggleUncoupleRecouple());
      expect(result.selected).toEqual(false);
    });
  });

  describe('UNCOUPLE_RECOUPLE_ADD_DRIVING_FAULT', () => {
    it('should add the correct fault', () => {
      const state: UncoupleRecouple = {};
      const result = uncoupleRecoupleReducer(state, UncoupleRecoupleAddDrivingFault());
      expect(result.selected).toEqual(true);
      expect(result.fault).toEqual(CompetencyOutcome.DF);
    });
  });

  describe('UNCOUPLE_RECOUPLE_ADD_SERIOUS_FAULT', () => {
    it('should add the correct fault', () => {
      const state: UncoupleRecouple = {};
      const result = uncoupleRecoupleReducer(state, UncoupleRecoupleAddSeriousFault());
      expect(result.selected).toEqual(true);
      expect(result.fault).toEqual(CompetencyOutcome.S);
    });
  });

  describe('UNCOUPLE_RECOUPLE_ADD_DANGEROUS_FAULT', () => {
    it('should add the correct fault', () => {
      const state: UncoupleRecouple = {};
      const result = uncoupleRecoupleReducer(state, UncoupleRecoupleAddDangerousFault());
      expect(result.selected).toEqual(true);
      expect(result.fault).toEqual(CompetencyOutcome.D);
    });
  });

  describe('UNCOUPLE_RECOUPLE_REMOVE_FAULT', () => {
    it('should remove the fault', () => {
      const state: UncoupleRecouple = {};
      const modifiedState = uncoupleRecoupleReducer(state, UncoupleRecoupleAddDangerousFault());
      const result = uncoupleRecoupleReducer(modifiedState, UncoupleRecoupleRemoveFault());
      expect(result.selected).toEqual(true);
      expect(result.fault).toBeUndefined();
      expect(result.faultComments).toBeUndefined();
    });
  });

  describe('ADD_UNCOUPLE_RECOUPLE_COMMENT', () => {
    it('should add a fault comment', () => {
      const state: UncoupleRecouple = {};
      const result = uncoupleRecoupleReducer(state, AddUncoupleRecoupleComment('Test'));
      expect(result.faultComments).toEqual('Test');
    });
  });
});

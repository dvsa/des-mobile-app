import { DrivingFaults } from '@dvsa/mes-test-schema/categories/common';
import { Competencies } from '../../../test-data.constants';
import { AddDrivingFault, AddDrivingFaultComment, RemoveDrivingFault } from '../driving-faults.actions';
import { drivingFaultsReducer } from '../driving-faults.reducer';

describe('Driving Faults Reducer', () => {
  describe('ADD_DRIVING_FAULT', () => {
    it('should add a driving fault when no driving faults exist', () => {
      const state: DrivingFaults = {};
      const result = drivingFaultsReducer(
        state,
        AddDrivingFault({
          competency: Competencies.controlsGears,
          newFaultCount: 1,
        })
      );
      expect(result.controlsGears).toEqual(1);
    });
    it('should update a driving fault when it already exists', () => {
      const state: DrivingFaults = {
        controlsGears: 1,
      };
      const result = drivingFaultsReducer(
        state,
        AddDrivingFault({
          competency: Competencies.controlsGears,
          newFaultCount: 2,
        })
      );
      expect(result.controlsGears).toEqual(2);
    });
    it('should not remove an existing driving fault when a one is added', () => {
      const state: DrivingFaults = {
        controlsParkingBrake: 1,
      };
      const result = drivingFaultsReducer(
        state,
        AddDrivingFault({
          competency: Competencies.controlsGears,
          newFaultCount: 1,
        })
      );
      expect(result.controlsGears).toEqual(1);
      expect(result.controlsParkingBrake).toEqual(1);
    });
  });

  describe('REMOVE_DRIVING_FAULT', () => {
    it('should remove a fault if the fault count is higher then 0', () => {
      const state: DrivingFaults = {
        awarenessPlanning: 2,
      };
      const result = drivingFaultsReducer(
        state,
        RemoveDrivingFault({
          competency: Competencies.awarenessPlanning,
          newFaultCount: 1,
        })
      );
      expect(result.awarenessPlanning).toEqual(1);
    });
    it('should remove the competency from the state if the fault count is 0', () => {
      const state: DrivingFaults = {
        awarenessPlanning: 1,
      };
      const result = drivingFaultsReducer(
        state,
        RemoveDrivingFault({
          competency: Competencies.awarenessPlanning,
          newFaultCount: 0,
        })
      );
      expect(result.awarenessPlanning).toBeUndefined();
    });
  });

  describe('ADD_DRIVING_FAULT_COMMENT', () => {
    it('should add a comment for a particular driving fault', () => {
      const state: DrivingFaults = {};
      const result = drivingFaultsReducer(state, AddDrivingFaultComment(Competencies.ancillaryControls, 'Test'));
      expect(result.ancillaryControlsComments).toEqual('Test');
    });
  });
});

import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { FaultCountADIPart2Helper } from '../fault-count.cat-adi-part2';
import {
  catADI2TestDataStateObjectControlledStopDrivingFaults,
  catADI2TestDataStateObjectDangerousFaults,
  catADI2TestDataStateObjectManoeuvreFaults,
  catADI2TestDataStateObjectNoDrivingFaults,
  catADI2TestDataStateObjectSeriousFaults,
  catADI2TestDataStateObjectShowMeFaults,
  catADI2TestDataStateObjectTellMeFaults,
} from '../../__mocks__/cat-ADI2-test-data-state-object.mock';

describe('FaultCountADIPart2Helper', () => {
  describe('getDrivingFaultSumCountCatADIPart2', () => {
    it('Should return 0 when no driving faults exist', () => {
      const temp = FaultCountADIPart2Helper
        .getDrivingFaultSumCountCatADIPart2(catADI2TestDataStateObjectNoDrivingFaults);
      expect(temp)
        .toEqual(0);
    });

    it('Should return 1 when manoeuvre fault exists', () => {
      const temp = FaultCountADIPart2Helper
        .getDrivingFaultSumCountCatADIPart2(catADI2TestDataStateObjectManoeuvreFaults);
      expect(temp)
        .toEqual(1);
    });

    it('Should return 2 when 2 vehicle check driving fault exists', () => {
      const temp = FaultCountADIPart2Helper.getDrivingFaultSumCountCatADIPart2(catADI2TestDataStateObjectShowMeFaults);
      expect(temp)
        .toEqual(2);
    });

    it('Should return 1 when a controlledStop driving fault exists', () => {
      const temp = FaultCountADIPart2Helper.getDrivingFaultSumCountCatADIPart2(
        catADI2TestDataStateObjectControlledStopDrivingFaults,
      );
      expect(temp)
        .toEqual(1);
    });

    describe('getSeriousFaultSumCountCatADIPart2', () => {
      it('Should return 0 when no serious faults exist', () => {
        const temp = FaultCountADIPart2Helper
          .getSeriousFaultSumCountCatADIPart2(catADI2TestDataStateObjectNoDrivingFaults);
        expect(temp)
          .toEqual(0);
      });

      it('Should return 5 when serious fault exists (1 for each type)', () => {
        const temp = FaultCountADIPart2Helper
          .getSeriousFaultSumCountCatADIPart2(catADI2TestDataStateObjectSeriousFaults);
        expect(temp)
          .toEqual(5);
      });
    });

    describe('getDangerousFaultSumCountCatADIPart2', () => {
      it('Should return 0 when no dangerous faults exist', () => {
        const temp = FaultCountADIPart2Helper
          .getDangerousFaultSumCountCatADIPart2(catADI2TestDataStateObjectNoDrivingFaults);
        expect(temp)
          .toEqual(0);
      });

      it('Should return 4 when dangerous fault exists (1 for each type)', () => {
        const temp = FaultCountADIPart2Helper
          .getDangerousFaultSumCountCatADIPart2(catADI2TestDataStateObjectDangerousFaults);
        expect(temp)
          .toEqual(4);
      });
    });

    describe('getVehicleChecksFaultCountCatADIPart2', () => {
      it('Should return 0 driving faults, 0 serious faults when no vehicleCheck faults exist', () => {

        const expectedValue = {
          drivingFaults: 0,
          seriousFaults: 0,
        };

        const temp = FaultCountADIPart2Helper.getVehicleChecksFaultCountCatADIPart2(
          catADI2TestDataStateObjectNoDrivingFaults.vehicleChecks,
        );
        expect(temp)
          .toEqual(expectedValue);
      });

      it('Should return 2 driving faults, 0 serious faults when 2 vehicleCheck faults exist', () => {

        const expectedValue = {
          drivingFaults: 2,
          seriousFaults: 0,
        };

        const temp = FaultCountADIPart2Helper.getVehicleChecksFaultCountCatADIPart2(
          catADI2TestDataStateObjectTellMeFaults.vehicleChecks,
        );
        expect(temp)
          .toEqual(expectedValue);
      });
    });

    describe('getVehicleChecksByOutcomeFaultCountCatADIPart2', () => {
      it('Should return 0 when no driving faults exist', () => {
        const temp = FaultCountADIPart2Helper.getVehicleChecksByOutcomeFaultCountCatADIPart2(
          catADI2TestDataStateObjectNoDrivingFaults.vehicleChecks,
          CompetencyOutcome.DF,
        );
        expect(temp)
          .toEqual(0);
      });

      it('Should return 2 driving fault exists', () => {
        const temp = FaultCountADIPart2Helper.getVehicleChecksByOutcomeFaultCountCatADIPart2(
          catADI2TestDataStateObjectTellMeFaults.vehicleChecks,
          CompetencyOutcome.DF,
        );
        expect(temp)
          .toEqual(2);
      });
    });

    describe('getShowMeFaultCount', () => {
      it('Should return 0 driving faults, 0 serious faults when no vehicleCheck faults exist', () => {

        const expectedValue = {
          drivingFaults: 0,
          seriousFaults: 0,
        };

        const temp = FaultCountADIPart2Helper.getShowMeFaultCount(
          catADI2TestDataStateObjectNoDrivingFaults.vehicleChecks,
        );
        expect(temp)
          .toEqual(expectedValue);
      });

      it('Should return 2 driving faults, 0 serious faults when 2 vehicleCheck faults exist', () => {

        const expectedValue = {
          drivingFaults: 2,
          seriousFaults: 0,
        };

        const temp = FaultCountADIPart2Helper.getShowMeFaultCount(
          catADI2TestDataStateObjectShowMeFaults.vehicleChecks,
        );
        expect(temp)
          .toEqual(expectedValue);
      });
    });

    describe('getTellMeFaultCount', () => {
      it('Should return 0 driving faults, 0 serious faults when no vehicleCheck faults exist', () => {

        const expectedValue = {
          drivingFaults: 0,
          seriousFaults: 0,
        };

        const temp = FaultCountADIPart2Helper.getTellMeFaultCount(
          catADI2TestDataStateObjectNoDrivingFaults.vehicleChecks,
        );
        expect(temp)
          .toEqual(expectedValue);
      });

      it('Should return 2 driving faults, 0 serious faults when 2 vehicleCheck faults exist', () => {

        const expectedValue = {
          drivingFaults: 2,
          seriousFaults: 0,
        };

        const temp = FaultCountADIPart2Helper.getTellMeFaultCount(
          catADI2TestDataStateObjectTellMeFaults.vehicleChecks,
        );
        expect(temp)
          .toEqual(expectedValue);
      });
    });
  });
});

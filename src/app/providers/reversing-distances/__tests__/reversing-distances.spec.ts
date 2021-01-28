import { TestBed } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { configureTestSuite } from 'ng-bullet';
import { ReversingDistancesProvider } from '../reversing-distances';
import { VehicleDetailsUnion } from '../../../shared/unions/test-schema-unions';

describe('ReversingDistancesProvider', () => {

  let reversingDistancesProvider: ReversingDistancesProvider;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        ReversingDistancesProvider,
      ],
    });
  });

  beforeEach(() => {
    reversingDistancesProvider = TestBed.inject(ReversingDistancesProvider);
  });

  describe('getDistanceLength', () => {
    const vehicleDetails: VehicleDetailsUnion = {
      vehicleLength: 15,
      vehicleWidth: 2,
    };

    const vehicleDetailsDecimal: VehicleDetailsUnion = {
      vehicleLength: 15.55,
      vehicleWidth: 2,
    };
    const longVehicleDetails: VehicleDetailsUnion = {
      vehicleLength: 20,
      vehicleWidth: 2,
    };

    const longVehicleDetailsDecimal: VehicleDetailsUnion = {
      vehicleLength: 16.75,
      vehicleWidth: 2,
    };

    // CAT C
    describe('Category C', () => {
      it('should return a start value 3 and a half times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.C);
        expect(result.startDistance).toEqual(52.5);
      });

      it('should return a start value 3 and a half times vehicle length if > 16.5', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.C);
        expect(result.startDistance).toEqual(70);
      });

      it('should return a start value 3 and a half times vehicle length to 2 fixed decimal places', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetailsDecimal, TestCategory.C);
        expect(result.startDistance).toEqual(58.63);
      });

      it('should return a middle value 1 and a half times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.C);
        expect(result.middleDistance).toEqual(22.5);
      });

      it('should return a middle value 1 and a half times the vehicle length to 2 fixed decimal places', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetailsDecimal, TestCategory.C);
        expect(result.middleDistance).toEqual(23.33);
      });
    });

    describe('Category C+E', () => {
      it('should return a start value 4 times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.CE);
        expect(result.startDistance).toEqual(60);
      });

      it('should return a start value of 66 if the vehicle length > than 16.5', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.CE);
        expect(result.startDistance).toEqual(66);
      });

      it('should return the correct middle value if the vehicle length is > 16.5', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.CE);
        expect(result.middleDistance).toEqual(26);
      });

      it('should return the correct middle value for vehicles > 16.5 with decimal places', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetailsDecimal, TestCategory.CE);
        expect(result.middleDistance).toEqual(32.5);
      });

      it('should return the correct middle value for vehicles > 16.5 with decimal places', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength({
          ...longVehicleDetailsDecimal, vehicleLength: 17.25,
        }, TestCategory.CE);
        expect(result.middleDistance).toEqual(31.5);
      });

      it('should return the correct middle value if the vehicle length is < 16.5', () => {
        // Calculation: 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.CE);
        expect(result.middleDistance).toEqual(30);
      });

      it('should return the correct middle value for vehicles < 16.5 with decimal places ', () => {
        // Calculation: 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetailsDecimal, TestCategory.CE);
        expect(result.middleDistance).toEqual(31.1);
      });
    });

    describe('Category C1', () => {
      it('should return a start value 3 and a half times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.C1);
        expect(result.startDistance).toEqual(52.5);
      });

      it('should return a start value 3 and a half times vehicle length if > 16.5', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.C1);
        expect(result.startDistance).toEqual(70);
      });

      it('should return a start value 3 and a half times vehicle length to 2 fixed decimal places', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetailsDecimal, TestCategory.C1);
        expect(result.startDistance).toEqual(58.63);
      });

      it('should return a middle value 1 and a half times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.C1);
        expect(result.middleDistance).toEqual(22.5);
      });

      it('should return a middle value 1 and a half times the vehicle length to 2 fixed decimal places', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetailsDecimal, TestCategory.C);
        expect(result.middleDistance).toEqual(23.33);
      });
    });

    describe('Category C1+E', () => {
      it('should return a start value 4 times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.C1E);
        expect(result.startDistance).toEqual(60);
      });

      it('should return a start value of 66 if the vehicle length is > 16.5', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.C1E);
        expect(result.startDistance).toEqual(66);
      });

      it('should return the correct middle value if the vehicle length is > 16.5', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.C1E);
        expect(result.middleDistance).toEqual(26);
      });

      it('should return the correct middle value for vehicles > 16.5 with decimal places', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetailsDecimal, TestCategory.C1E);
        expect(result.middleDistance).toEqual(32.5);
      });

      it('should return the correct middle value for vehicles > 16.5 with decimal places', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength({
          ...longVehicleDetailsDecimal, vehicleLength: 18.25,
        }, TestCategory.C1E);
        expect(result.middleDistance).toEqual(29.5);
      });

      it('should return the correct middle distance if the vehicle length is < 16.5', () => {
        // Calculation: 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.C1E);
        expect(result.middleDistance).toEqual(30);
      });

      it('should return the correct middle value for vehicles < 16.5 with decimal places ', () => {
        // Calculation: 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetailsDecimal, TestCategory.C1E);
        expect(result.middleDistance).toEqual(31.1);
      });
    });

    // CAT D
    describe('Category D', () => {
      it('should return a start value 3 and a half times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.D);
        expect(result.startDistance).toEqual(52.5);
      });

      it('should return a start value 3 and a half times vehicle length if > 16.5', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.D);
        expect(result.startDistance).toEqual(70);
      });

      it('should return a start value 3 and a half times vehicle length to 2 fixed decimal places', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetailsDecimal, TestCategory.D);
        expect(result.startDistance).toEqual(58.63);
      });

      it('should return a middle value 1 and a half times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.D);
        expect(result.middleDistance).toEqual(22.5);
      });

      it('should return a middle value 1 and a half times the vehicle length to 2 fixed decimal places', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetailsDecimal, TestCategory.D);
        expect(result.middleDistance).toEqual(23.33);
      });
    });

    describe('Category D+E', () => {
      it('should return a start value 4 times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.DE);
        expect(result.startDistance).toEqual(60);
      });

      it('should return a start value of 66 if the vehicle length is > 16.5', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.DE);
        expect(result.startDistance).toEqual(66);
      });

      it('should return the correct middle distance if the vehicle length is > 16.5', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.DE);
        expect(result.middleDistance).toEqual(26);
      });

      it('should return the correct middle value for vehicles > 16.5 with decimal places', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetailsDecimal, TestCategory.DE);
        expect(result.middleDistance).toEqual(32.5);
      });

      it('should return the correct middle value for vehicles > 16.5 with decimal places', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength({
          ...longVehicleDetailsDecimal, vehicleLength: 17.25,
        }, TestCategory.DE);
        expect(result.middleDistance).toEqual(31.5);
      });

      it('should return the correct middle distance if the vehicle length is < 16.5', () => {
        // Calculation: 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.DE);
        expect(result.middleDistance).toEqual(30);
      });

      it('should return the correct middle value for vehicles < 16.5 with decimal places ', () => {
        // Calculation: 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetailsDecimal, TestCategory.DE);
        expect(result.middleDistance).toEqual(31.1);
      });
    });

    describe('Category D1', () => {
      it('should return a start value 3 and a half times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.D1);
        expect(result.startDistance).toEqual(52.5);
      });

      it('should return a start value 3 and a half times vehicle length if > 16.5', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.D1);
        expect(result.startDistance).toEqual(70);
      });

      it('should return a start value 3 and a half times vehicle length to 2 fixed decimal places', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetailsDecimal, TestCategory.D1);
        expect(result.startDistance).toEqual(58.63);
      });

      it('should return a middle value 1 and a half times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.D1);
        expect(result.middleDistance).toEqual(22.5);
      });

      it('should return a middle value 1 and a half times the vehicle length to 2 fixed decimal places', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetailsDecimal, TestCategory.D1);
        expect(result.middleDistance).toEqual(23.33);
      });
    });

    describe('Category D1+E', () => {
      it('should return a start value 4 times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.D1E);
        expect(result.startDistance).toEqual(60);
      });

      it('should return a start value of 66 if the vehicle length is > 16.5', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.D1E);
        expect(result.startDistance).toEqual(66);
      });

      it('should return the correct middle distance if the vehicle length is > 16.5', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.D1E);
        expect(result.middleDistance).toEqual(26);
      });

      it('should return the correct middle value for vehicles > 16.5 with decimal places', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetailsDecimal, TestCategory.D1E);
        expect(result.middleDistance).toEqual(32.5);
      });

      it('should return the correct middle value for vehicles > 16.5 with decimal places', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength({
          ...longVehicleDetailsDecimal, vehicleLength: 18.25,
        }, TestCategory.C1E);
        expect(result.middleDistance).toEqual(29.5);
      });

      it('should return the correct middle distance if the vehicle length is < 16.5', () => {
        // Calculation: 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.D1E);
        expect(result.middleDistance).toEqual(30);
      });

      it('should return the correct middle value for vehicles < 16.5 with decimal places ', () => {
        // Calculation: 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetailsDecimal, TestCategory.D1E);
        expect(result.middleDistance).toEqual(31.1);
      });
    });
  });

  describe('getDistanceWidth', () => {
    const vehicleDetails: VehicleDetailsUnion = {
      vehicleLength: 15,
      vehicleWidth: 2,
    };

    // CAT C
    describe('Category C', () => {
      it('should return a value 1 and a half times the vehicle width', () => {
        const result = reversingDistancesProvider.getDistanceWidth(vehicleDetails, TestCategory.C);
        expect(result).toEqual(3);
      });
    });

    describe('Category C+E', () => {
      it('should return a value 1 and a half times the vehicle width', () => {
        const result = reversingDistancesProvider.getDistanceWidth(vehicleDetails, TestCategory.CE);
        expect(result).toEqual(3);
      });
    });

    describe('Category C1', () => {
      it('should return a value 1 and a half times the vehicle width', () => {
        const result = reversingDistancesProvider.getDistanceWidth(vehicleDetails, TestCategory.C1);
        expect(result).toEqual(3);
      });
    });

    describe('Category C1+E', () => {
      it('should return a value 1 and a half times the vehicle width', () => {
        const result = reversingDistancesProvider.getDistanceWidth(vehicleDetails, TestCategory.C1E);
        expect(result).toEqual(3);
      });
    });

    // CAT D
    describe('Category D', () => {
      it('should return a value 1 and a half times the vehicle width', () => {
        const result = reversingDistancesProvider.getDistanceWidth(vehicleDetails, TestCategory.D);
        expect(result).toEqual(3);
      });
    });

    describe('Category D+E', () => {
      it('should return a value 1 and a half times the vehicle width', () => {
        const result = reversingDistancesProvider.getDistanceWidth(vehicleDetails, TestCategory.DE);
        expect(result).toEqual(3);
      });
    });

    describe('Category D1', () => {
      it('should return a value 1 and a half times the vehicle width', () => {
        const result = reversingDistancesProvider.getDistanceWidth(vehicleDetails, TestCategory.D1);
        expect(result).toEqual(3);
      });
    });

    describe('Category D1+E', () => {
      it('should return a value 1 and a half times the vehicle width', () => {
        const result = reversingDistancesProvider.getDistanceWidth(vehicleDetails, TestCategory.D1E);
        expect(result).toEqual(3);
      });
    });
  });
});

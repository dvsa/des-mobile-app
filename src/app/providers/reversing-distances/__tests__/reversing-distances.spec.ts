import { TestBed } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { VehicleDetailsUnion } from '@shared/unions/test-schema-unions';
import { ReversingDistancesProvider } from '../reversing-distances';

describe('ReversingDistancesProvider', () => {
  let reversingDistancesProvider: ReversingDistancesProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReversingDistancesProvider,
      ],
    });

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
    describe('Category CM', () => {
      it('should return a start value 3 and a half times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.CM);
        expect(result.startDistance)
          .toEqual(52.5);
      });

      it('should return a start value 3 and a half times vehicle length if > 16.5', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.CM);
        expect(result.startDistance)
          .toEqual(70);
      });

      it('should return a start value 3 and a half times vehicle length to 2 fixed decimal places', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetailsDecimal, TestCategory.CM);
        expect(result.startDistance)
          .toEqual(58.63);
      });

      it('should return a middle value 1 and a half times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.CM);
        expect(result.middleDistance)
          .toEqual(22.5);
      });

      it('should return a middle value 1 and a half times the vehicle length to 2 fixed decimal places', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetailsDecimal, TestCategory.CM);
        expect(result.middleDistance)
          .toEqual(23.33);
      });
    });

    describe('Category C+EM', () => {
      it('should return a start value 4 times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.CEM);
        expect(result.startDistance)
          .toEqual(60);
      });

      it('should return a start value of 66 if the vehicle length > than 16.5', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.CEM);
        expect(result.startDistance)
          .toEqual(66);
      });

      it('should return the correct middle value if the vehicle length is > 16.5', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.CEM);
        expect(result.middleDistance)
          .toEqual(26);
      });

      it('should return the correct middle value for vehicles > 16.5 with decimal places', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetailsDecimal, TestCategory.CEM);
        expect(result.middleDistance)
          .toEqual(32.5);
      });

      it('should return the correct middle value for vehicles > 16.5 with decimal places', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength({
          ...longVehicleDetailsDecimal,
          vehicleLength: 17.25,
        }, TestCategory.CEM);
        expect(result.middleDistance)
          .toEqual(31.5);
      });

      it('should return the correct middle value if the vehicle length is < 16.5', () => {
        // Calculation: 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.CEM);
        expect(result.middleDistance)
          .toEqual(30);
      });

      it('should return the correct middle value for vehicles < 16.5 with decimal places ', () => {
        // Calculation: 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetailsDecimal, TestCategory.CEM);
        expect(result.middleDistance)
          .toEqual(31.1);
      });
    });

    describe('Category C1M', () => {
      it('should return a start value 3 and a half times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.C1M);
        expect(result.startDistance)
          .toEqual(52.5);
      });

      it('should return a start value 3 and a half times vehicle length if > 16.5', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.C1M);
        expect(result.startDistance)
          .toEqual(70);
      });

      it('should return a start value 3 and a half times vehicle length to 2 fixed decimal places', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetailsDecimal, TestCategory.C1M);
        expect(result.startDistance)
          .toEqual(58.63);
      });

      it('should return a middle value 1 and a half times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.C1M);
        expect(result.middleDistance)
          .toEqual(22.5);
      });

      it('should return a middle value 1 and a half times the vehicle length to 2 fixed decimal places', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetailsDecimal, TestCategory.CM);
        expect(result.middleDistance)
          .toEqual(23.33);
      });
    });

    describe('Category C1+EM', () => {
      it('should return a start value 4 times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.C1EM);
        expect(result.startDistance)
          .toEqual(60);
      });

      it('should return a start value of 66 if the vehicle length is > 16.5', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.C1EM);
        expect(result.startDistance)
          .toEqual(66);
      });

      it('should return the correct middle value if the vehicle length is > 16.5', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.C1EM);
        expect(result.middleDistance)
          .toEqual(26);
      });

      it('should return the correct middle value for vehicles > 16.5 with decimal places', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetailsDecimal, TestCategory.C1EM);
        expect(result.middleDistance)
          .toEqual(32.5);
      });

      it('should return the correct middle value for vehicles > 16.5 with decimal places', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength({
          ...longVehicleDetailsDecimal,
          vehicleLength: 18.25,
        }, TestCategory.C1EM);
        expect(result.middleDistance)
          .toEqual(29.5);
      });

      it('should return the correct middle distance if the vehicle length is < 16.5', () => {
        // Calculation: 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.C1EM);
        expect(result.middleDistance)
          .toEqual(30);
      });

      it('should return the correct middle value for vehicles < 16.5 with decimal places ', () => {
        // Calculation: 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetailsDecimal, TestCategory.C1EM);
        expect(result.middleDistance)
          .toEqual(31.1);
      });
    });

    // CAT D
    describe('Category DM', () => {
      it('should return a start value 3 and a half times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.DM);
        expect(result.startDistance)
          .toEqual(52.5);
      });

      it('should return a start value 3 and a half times vehicle length if > 16.5', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.DM);
        expect(result.startDistance)
          .toEqual(70);
      });

      it('should return a start value 3 and a half times vehicle length to 2 fixed decimal places', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetailsDecimal, TestCategory.DM);
        expect(result.startDistance)
          .toEqual(58.63);
      });

      it('should return a middle value 1 and a half times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.DM);
        expect(result.middleDistance)
          .toEqual(22.5);
      });

      it('should return a middle value 1 and a half times the vehicle length to 2 fixed decimal places', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetailsDecimal, TestCategory.DM);
        expect(result.middleDistance)
          .toEqual(23.33);
      });
    });

    describe('Category D+EM', () => {
      it('should return a start value 4 times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.DEM);
        expect(result.startDistance)
          .toEqual(60);
      });

      it('should return a start value of 66 if the vehicle length is > 16.5', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.DEM);
        expect(result.startDistance)
          .toEqual(66);
      });

      it('should return the correct middle distance if the vehicle length is > 16.5', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.DEM);
        expect(result.middleDistance)
          .toEqual(26);
      });

      it('should return the correct middle value for vehicles > 16.5 with decimal places', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetailsDecimal, TestCategory.DEM);
        expect(result.middleDistance)
          .toEqual(32.5);
      });

      it('should return the correct middle value for vehicles > 16.5 with decimal places', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength({
          ...longVehicleDetailsDecimal,
          vehicleLength: 17.25,
        }, TestCategory.DEM);
        expect(result.middleDistance)
          .toEqual(31.5);
      });

      it('should return the correct middle distance if the vehicle length is < 16.5', () => {
        // Calculation: 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.DEM);
        expect(result.middleDistance)
          .toEqual(30);
      });

      it('should return the correct middle value for vehicles < 16.5 with decimal places ', () => {
        // Calculation: 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetailsDecimal, TestCategory.DEM);
        expect(result.middleDistance)
          .toEqual(31.1);
      });
    });

    describe('Category D1M', () => {
      it('should return a start value 3 and a half times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.D1M);
        expect(result.startDistance)
          .toEqual(52.5);
      });

      it('should return a start value 3 and a half times vehicle length if > 16.5', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.D1M);
        expect(result.startDistance)
          .toEqual(70);
      });

      it('should return a start value 3 and a half times vehicle length to 2 fixed decimal places', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetailsDecimal, TestCategory.D1M);
        expect(result.startDistance)
          .toEqual(58.63);
      });

      it('should return a middle value 1 and a half times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.D1M);
        expect(result.middleDistance)
          .toEqual(22.5);
      });

      it('should return a middle value 1 and a half times the vehicle length to 2 fixed decimal places', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetailsDecimal, TestCategory.D1M);
        expect(result.middleDistance)
          .toEqual(23.33);
      });
    });

    describe('Category D1+EM', () => {
      it('should return a start value 4 times the vehicle length', () => {
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.D1EM);
        expect(result.startDistance)
          .toEqual(60);
      });

      it('should return a start value of 66 if the vehicle length is > 16.5', () => {
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.D1EM);
        expect(result.startDistance)
          .toEqual(66);
      });

      it('should return the correct middle distance if the vehicle length is > 16.5', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetails, TestCategory.D1EM);
        expect(result.middleDistance)
          .toEqual(26);
      });

      it('should return the correct middle value for vehicles > 16.5 with decimal places', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(longVehicleDetailsDecimal, TestCategory.D1EM);
        expect(result.middleDistance)
          .toEqual(32.5);
      });

      it('should return the correct middle value for vehicles > 16.5 with decimal places', () => {
        // Calculation: 66 - 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength({
          ...longVehicleDetailsDecimal,
          vehicleLength: 18.25,
        }, TestCategory.C1EM);
        expect(result.middleDistance)
          .toEqual(29.5);
      });

      it('should return the correct middle distance if the vehicle length is < 16.5', () => {
        // Calculation: 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetails, TestCategory.D1EM);
        expect(result.middleDistance)
          .toEqual(30);
      });

      it('should return the correct middle value for vehicles < 16.5 with decimal places ', () => {
        // Calculation: 2 x vehicle length
        const result = reversingDistancesProvider.getDistanceLength(vehicleDetailsDecimal, TestCategory.D1EM);
        expect(result.middleDistance)
          .toEqual(31.1);
      });
    });
  });

  describe('getDistanceWidth', () => {
    const vehicleDetails: VehicleDetailsUnion = {
      vehicleLength: 15,
      vehicleWidth: 2,
    };

    // CAT C
    describe('Category CM', () => {
      it('should return a value 1 and a half times the vehicle width', () => {
        const result = reversingDistancesProvider.getDistanceWidth(vehicleDetails, TestCategory.CM);
        expect(result)
          .toEqual(3);
      });
    });

    describe('Category C+EM', () => {
      it('should return a value 1 and a half times the vehicle width', () => {
        const result = reversingDistancesProvider.getDistanceWidth(vehicleDetails, TestCategory.CEM);
        expect(result)
          .toEqual(3);
      });
    });

    describe('Category C1M', () => {
      it('should return a value 1 and a half times the vehicle width', () => {
        const result = reversingDistancesProvider.getDistanceWidth(vehicleDetails, TestCategory.C1M);
        expect(result)
          .toEqual(3);
      });
    });

    describe('Category C1+EM', () => {
      it('should return a value 1 and a half times the vehicle width', () => {
        const result = reversingDistancesProvider.getDistanceWidth(vehicleDetails, TestCategory.C1EM);
        expect(result)
          .toEqual(3);
      });
    });

    // CAT D
    describe('Category DM', () => {
      it('should return a value 1 and a half times the vehicle width', () => {
        const result = reversingDistancesProvider.getDistanceWidth(vehicleDetails, TestCategory.DM);
        expect(result)
          .toEqual(3);
      });
    });

    describe('Category D+EM', () => {
      it('should return a value 1 and a half times the vehicle width', () => {
        const result = reversingDistancesProvider.getDistanceWidth(vehicleDetails, TestCategory.DEM);
        expect(result)
          .toEqual(3);
      });
    });

    describe('Category D1M', () => {
      it('should return a value 1 and a half times the vehicle width', () => {
        const result = reversingDistancesProvider.getDistanceWidth(vehicleDetails, TestCategory.D1M);
        expect(result)
          .toEqual(3);
      });
    });

    describe('Category D1+EM', () => {
      it('should return a value 1 and a half times the vehicle width', () => {
        const result = reversingDistancesProvider.getDistanceWidth(vehicleDetails, TestCategory.D1EM);
        expect(result)
          .toEqual(3);
      });
    });
  });
});

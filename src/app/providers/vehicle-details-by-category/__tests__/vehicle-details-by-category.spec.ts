import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  getVehicleDetails as getVehicleDetailsC,
} from '@store/tests/vehicle-details/cat-c/vehicle-details.cat-c.reducer';
import {
  getVehicleDetails as getVehicleDetailsManoeuvre,
} from '@store/tests/vehicle-details/cat-manoeuvres/vehicle-details.cat-manoeuvre.reducer';
import {
  getVehicleDetails as getVehicleDetailsD,
} from '@store/tests/vehicle-details/cat-d/vehicle-details.cat-d.reducer';
import {
  getVehicleDetails as getVehicleDetailsB,
} from '@store/tests/vehicle-details/cat-b/vehicle-details.cat-b.reducer';
import {
  getVehicleDetails as getVehicleDetailsADI2,
} from '@store/tests/vehicle-details/cat-adi-part2/vehicle-details.cat-adi-part2.reducer';
import {
  getVehicleDetails as getVehicleDetailsADI3,
} from '@store/tests/vehicle-details/cat-adi-part3/vehicle-details.cat-adi-part3.reducer';
import {
  getVehicleDetails as getVehicleDetailsAM1,
} from '@store/tests/vehicle-details/cat-a-mod1/vehicle-details.cat-a-mod1.reducer';
import {
  getVehicleDetails as getVehicleDetailsAM2,
} from '@store/tests/vehicle-details/cat-a-mod2/vehicle-details.cat-a-mod2.reducer';
import {
  getVehicleDetails as getVehicleDetailsCPC,
} from '@store/tests/vehicle-details/cat-cpc/vehicle-details.cat-cpc.reducer';
import {
  getVehicleLength as getVehicleLengthC,
  getVehicleWidth as getVehicleWidthC,
} from '@store/tests/vehicle-details/cat-c/vehicle-details.cat-c.selector';
import {
  getVehicleLength as getVehicleLengthD,
  getVehicleWidth as getVehicleWidthD,
} from '@store/tests/vehicle-details/cat-d/vehicle-details.cat-d.selector';
import {
  getVehicleLength as getVehicleLengthManoeuvre,
  getVehicleWidth as getVehicleWidthManoeuvre,
} from '@store/tests/vehicle-details/cat-manoeuvres/vehicle-details.cat-manoeuvre.selector';
import { getVehicleDetails } from '@store/tests/vehicle-details/cat-home-test/vehicle-details.reducer';
import { VehicleDetailsByCategoryProvider } from '../vehicle-details-by-category';

describe('VehicleDetailsByCategoryProvider', () => {
  let provider: VehicleDetailsByCategoryProvider;

  beforeEach(() => {
    provider = new VehicleDetailsByCategoryProvider();
  });

  describe('getVehicleDetailsByCategoryCode', () => {

    it('should return Cat C vehicle details for a C category code', () => {
      expect(() => {
        const vehicleData = provider.getVehicleDetailsByCategoryCode(TestCategory.C);
        expect(vehicleData)
          .toEqual({
            vehicleDetails: getVehicleDetailsC,
            vehicleLength: getVehicleLengthC,
            vehicleWidth: getVehicleWidthC,
          });
      })
        .not
        .toThrowError('Error getting test category vehicle details');
    });
    it('should return Cat ADI2 vehicle details for a ADI2 category code', () => {
      expect(() => {
        const vehicleData = provider.getVehicleDetailsByCategoryCode(TestCategory.ADI2);
        expect(vehicleData)
          .toEqual({
            vehicleDetails: getVehicleDetailsADI2,
            vehicleLength: null,
            vehicleWidth: null,
          });
      })
        .not
        .toThrowError('Error getting test category vehicle details');
    });
    it('should return Cat ADI3 vehicle details for a ADI3 category code', () => {
      expect(() => {
        const vehicleData = provider.getVehicleDetailsByCategoryCode(TestCategory.ADI3);
        expect(vehicleData)
          .toEqual({
            vehicleDetails: getVehicleDetailsADI3,
            vehicleLength: null,
            vehicleWidth: null,
          });
      })
        .not
        .toThrowError('Error getting test category vehicle details');
    });
    it('should return Cat B vehicle details for a B category code', () => {
      expect(() => {
        const vehicleData = provider.getVehicleDetailsByCategoryCode(TestCategory.B);
        expect(vehicleData)
          .toEqual({
            vehicleDetails: getVehicleDetailsB,
            vehicleLength: null,
            vehicleWidth: null,
          });
      })
        .not
        .toThrowError('Error getting test category vehicle details');
    });
    it('should return Cat CM vehicle details for a CM category code', () => {
      expect(() => {
        const vehicleData = provider.getVehicleDetailsByCategoryCode(TestCategory.CM);
        expect(vehicleData)
          .toEqual({
            vehicleDetails: getVehicleDetailsManoeuvre,
            vehicleLength: getVehicleLengthManoeuvre,
            vehicleWidth: getVehicleWidthManoeuvre,
          });
      })
        .not
        .toThrowError('Error getting test category vehicle details');
    });
    it('should return Cat D vehicle details for a D category code', () => {
      expect(() => {
        const vehicleData = provider.getVehicleDetailsByCategoryCode(TestCategory.D);
        expect(vehicleData)
          .toEqual({
            vehicleDetails: getVehicleDetailsD,
            vehicleLength: getVehicleLengthD,
            vehicleWidth: getVehicleWidthD,
          });
      })
        .not
        .toThrowError('Error getting test category vehicle details');
    });
    it('should return Cat CCPC vehicle details for a CCPC category code', () => {
      expect(() => {
        const vehicleData = provider.getVehicleDetailsByCategoryCode(TestCategory.CCPC);
        expect(vehicleData)
          .toEqual({
            vehicleDetails: getVehicleDetailsCPC,
            vehicleLength: null,
            vehicleWidth: null,
          });
      })
        .not
        .toThrowError('Error getting test category vehicle details');
    });
    it('should return Cat F vehicle details for a F category code', () => {
      expect(() => {
        const vehicleData = provider.getVehicleDetailsByCategoryCode(TestCategory.F);
        expect(vehicleData)
          .toEqual({
            vehicleDetails: getVehicleDetails,
            vehicleLength: null,
            vehicleWidth: null,
          });
      })
        .not
        .toThrowError('Error getting test category vehicle details');
    });
    it('should return Cat EUAM1 vehicle details for a EUAM1 category code', () => {
      expect(() => {
        const vehicleData = provider.getVehicleDetailsByCategoryCode(TestCategory.EUAM1);
        expect(vehicleData)
          .toEqual({
            vehicleDetails: getVehicleDetailsAM1,
            vehicleLength: null,
            vehicleWidth: null,
          });
      })
        .not
        .toThrowError('Error getting test category vehicle details');
    });
    it('should return Cat EUA1M1 vehicle details for a EUA1M1 category code', () => {
      expect(() => {
        const vehicleData = provider.getVehicleDetailsByCategoryCode(TestCategory.EUA1M1);
        expect(vehicleData)
          .toEqual({
            vehicleDetails: getVehicleDetailsAM1,
            vehicleLength: null,
            vehicleWidth: null,
          });
      })
        .not
        .toThrowError('Error getting test category vehicle details');
    });
    it('should return Cat EUAM2 vehicle details for a EUAM2 category code', () => {
      expect(() => {
        const vehicleData = provider.getVehicleDetailsByCategoryCode(TestCategory.EUAM2);
        expect(vehicleData)
          .toEqual({
            vehicleDetails: getVehicleDetailsAM2,
            vehicleLength: null,
            vehicleWidth: null,
          });
      })
        .not
        .toThrowError('Error getting test category vehicle details');
    });
    it('should return Cat EUA1M2 vehicle details for a EUA1M2 category code', () => {
      expect(() => {
        const vehicleData = provider.getVehicleDetailsByCategoryCode(TestCategory.EUA1M2);
        expect(vehicleData)
          .toEqual({
            vehicleDetails: getVehicleDetailsAM2,
            vehicleLength: null,
            vehicleWidth: null,
          });
      })
        .not
        .toThrowError('Error getting test category vehicle details');
    });

    it('should throw an error when there is no matching test category', () => {
      expect(() => {
        provider.getVehicleDetailsByCategoryCode('z' as TestCategory);
      })
        .toThrowError('Error getting test category vehicle details');
    });
    it('should throw an error when test category is undefined', () => {
      expect(() => {
        provider.getVehicleDetailsByCategoryCode(undefined);
      })
        .toThrowError('Error getting test category vehicle details');
    });
  });
});

import { Injectable } from '@angular/core';
import { CategoryCode, VehicleDetails as CommonVehicleDetails } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { VehicleDetails as CatADI3VehicleDetails } from '@dvsa/mes-test-schema/categories/ADI3';
import { VehicleDetails as CatMod1VehicleDetails } from '@dvsa/mes-test-schema/categories/AM1';
import { VehicleDetails as CatMod2VehicleDetails } from '@dvsa/mes-test-schema/categories/AM2';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { VehicleDetails as CatCPCVehicleDetails } from '@dvsa/mes-test-schema/categories/CPC';
import { DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { getVehicleDetails as getVehicleDetailsAM1 } from '@store/tests/vehicle-details/cat-a-mod1/vehicle-details.cat-a-mod1.reducer';
import { getVehicleDetails as getVehicleDetailsAM2 } from '@store/tests/vehicle-details/cat-a-mod2/vehicle-details.cat-a-mod2.reducer';
import { getVehicleDetails as getVehicleDetailsADI2 } from '@store/tests/vehicle-details/cat-adi-part2/vehicle-details.cat-adi-part2.reducer';
import { getVehicleDetails as getVehicleDetailsADI3 } from '@store/tests/vehicle-details/cat-adi-part3/vehicle-details.cat-adi-part3.reducer';
import { getVehicleDetails as getVehicleDetailsB } from '@store/tests/vehicle-details/cat-b/vehicle-details.cat-b.reducer';
import { getVehicleDetails as getVehicleDetailsC } from '@store/tests/vehicle-details/cat-c/vehicle-details.cat-c.reducer';
import {
  getVehicleLength as getVehicleLengthC,
  getVehicleWidth as getVehicleWidthC,
} from '@store/tests/vehicle-details/cat-c/vehicle-details.cat-c.selector';
import { getVehicleDetails as getVehicleDetailsCPC } from '@store/tests/vehicle-details/cat-cpc/vehicle-details.cat-cpc.reducer';
import { getVehicleDetails as getVehicleDetailsD } from '@store/tests/vehicle-details/cat-d/vehicle-details.cat-d.reducer';
import {
  getVehicleLength as getVehicleLengthD,
  getVehicleWidth as getVehicleWidthD,
} from '@store/tests/vehicle-details/cat-d/vehicle-details.cat-d.selector';
import { getVehicleDetails as getVehicleDetailsManoeuvre } from '@store/tests/vehicle-details/cat-manoeuvres/vehicle-details.cat-manoeuvre.reducer';
import {
  getVehicleLength as getVehicleLengthManoeuvre,
  getVehicleWidth as getVehicleWidthManoeuvre,
} from '@store/tests/vehicle-details/cat-manoeuvres/vehicle-details.cat-manoeuvre.selector';
import { getVehicleDetails } from '@store/tests/vehicle-details/vehicle-details.reducer';

import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { CatCMUniqueTypes } from '@dvsa/mes-test-schema/categories/CM';
import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';

export interface CategorySpecificVehicleDetails<T> {
  vehicleDetails: MemoizedSelector<object, T, DefaultProjectorFn<T>>;
  vehicleWidth: (data: T) => number;
  vehicleLength: (data: T) => number;
}

@Injectable()
export class VehicleDetailsByCategoryProvider {
  static getVehicleDetailsByCategoryCodeErrMsg = 'Error getting test category vehicle details';

  public getVehicleDetailsByCategoryCode(category: CategoryCode) {
    switch (category) {
      case TestCategory.ADI2:
        return {
          vehicleDetails: getVehicleDetailsADI2,
          vehicleWidth: null,
          vehicleLength: null,
        } as CategorySpecificVehicleDetails<CatADI2UniqueTypes.VehicleDetails>;
      case TestCategory.ADI3:
      case TestCategory.SC:
        return {
          vehicleDetails: getVehicleDetailsADI3,
          vehicleWidth: null,
          vehicleLength: null,
        } as CategorySpecificVehicleDetails<CatADI3VehicleDetails>;
      case TestCategory.B:
        return {
          vehicleDetails: getVehicleDetailsB,
          vehicleWidth: null,
          vehicleLength: null,
        } as CategorySpecificVehicleDetails<CatBUniqueTypes.VehicleDetails>;
      case TestCategory.C:
      case TestCategory.C1:
      case TestCategory.CE:
      case TestCategory.C1E:
        return {
          vehicleDetails: getVehicleDetailsC,
          vehicleWidth: getVehicleWidthC,
          vehicleLength: getVehicleLengthC,
        } as CategorySpecificVehicleDetails<CatCUniqueTypes.VehicleDetails>;
      case TestCategory.CM:
      case TestCategory.C1M:
      case TestCategory.CEM:
      case TestCategory.C1EM:
      case TestCategory.DM:
      case TestCategory.D1M:
      case TestCategory.DEM:
      case TestCategory.D1EM:
        return {
          vehicleDetails: getVehicleDetailsManoeuvre,
          vehicleWidth: getVehicleWidthManoeuvre,
          vehicleLength: getVehicleLengthManoeuvre,
        } as CategorySpecificVehicleDetails<CatCMUniqueTypes.VehicleDetails>;
      case TestCategory.D:
      case TestCategory.D1:
      case TestCategory.DE:
      case TestCategory.D1E:
        return {
          vehicleDetails: getVehicleDetailsD,
          vehicleWidth: getVehicleWidthD,
          vehicleLength: getVehicleLengthD,
        } as CategorySpecificVehicleDetails<CatDUniqueTypes.VehicleDetails>;
      case TestCategory.CCPC:
      case TestCategory.DCPC:
        return {
          vehicleDetails: getVehicleDetailsCPC,
          vehicleWidth: null,
          vehicleLength: null,
        } as CategorySpecificVehicleDetails<CatCPCVehicleDetails>;
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
      case TestCategory.K:
        return {
          vehicleDetails: getVehicleDetails,
          vehicleWidth: null,
          vehicleLength: null,
        } as CategorySpecificVehicleDetails<CommonVehicleDetails>;
      case TestCategory.EUA1M1:
      case TestCategory.EUA2M1:
      case TestCategory.EUAM1:
      case TestCategory.EUAMM1:
        return {
          vehicleDetails: getVehicleDetailsAM1,
          vehicleWidth: null,
          vehicleLength: null,
        } as CategorySpecificVehicleDetails<CatMod1VehicleDetails>;
      case TestCategory.EUA1M2:
      case TestCategory.EUA2M2:
      case TestCategory.EUAM2:
      case TestCategory.EUAMM2:
        return {
          vehicleDetails: getVehicleDetailsAM2,
          vehicleWidth: null,
          vehicleLength: null,
        } as CategorySpecificVehicleDetails<CatMod2VehicleDetails>;
      default:
        throw new Error(VehicleDetailsByCategoryProvider.getVehicleDetailsByCategoryCodeErrMsg);
    }
  }
}

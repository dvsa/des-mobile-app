import { MotStatusCodes } from '@dvsa/mes-mot-schema';
import { VehicleDetails } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { createSelector } from '@ngrx/store';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { getTestCategory } from '@store/tests/category/category.reducer';

export const getRegistrationNumber = (vehicleDetails: VehicleDetails) => vehicleDetails.registrationNumber;
export const getGearboxCategory = (vehicleDetails: VehicleDetails) => vehicleDetails.gearboxCategory;
export const getMotStatus = (vehicleDetails: VehicleDetails) => vehicleDetails.motStatus as MotStatusCodes;
export const getMotEvidenceProvided = (vehicleDetails: VehicleDetails) => vehicleDetails.motEvidenceProvided;
export const getMotEvidenceDescription = (vehicleDetails: VehicleDetails) => vehicleDetails.motEvidence;
export const getVehicleMake = (vehicleDetails: VehicleDetails) => vehicleDetails.make;
export const getVehicleModel = (vehicleDetails: VehicleDetails) => vehicleDetails.model;
export const getTestExpiryDate = (vehicleDetails: VehicleDetails) => vehicleDetails.testExpiryDate;
export const getSearchedVRNList = (vehicleDetails: VehicleDetails) => vehicleDetails.previouslySearchedRegNumbers;
export const getSearchedVRNListNoDuplicates = (vehicleDetails: VehicleDetails) =>
  getPreviousFilteredVRNs(vehicleDetails.previouslySearchedRegNumbers, vehicleDetails.registrationNumber);
export const getMotEvidence = (vehicleDetails: VehicleDetails) => vehicleDetails.motEvidence;
export const isManual = (vehicleDetails: VehicleDetails) => vehicleDetails.gearboxCategory === 'Manual' || false;
export const isAutomatic = (vehicleDetails: VehicleDetails) => vehicleDetails.gearboxCategory === 'Automatic' || false;

/**
 * Get a list of previously searched VRNs that are not your final without duplicates
 */
export function getPreviousFilteredVRNs(previousVRNs: string[], registrationNumber: string): string[] {
  const filteredVRN: string[] = [];

  if (previousVRNs) {
    previousVRNs.forEach((value) => {
      if (!filteredVRN.includes(value) && value !== registrationNumber) {
        filteredVRN.push(value);
      }
    });
  }

  return filteredVRN;
}

export const selectShowVrnButton = createSelector(getTestCategory, (category) =>
  showVrnButton(category as TestCategory)
);

export const showVrnButton = (category: TestCategory): boolean =>
  isAnyOf(category, [
    TestCategory.ADI2,
    TestCategory.ADI3,
    TestCategory.SC,
    TestCategory.B,
    TestCategory.C,
    TestCategory.C1,
    TestCategory.CE,
    TestCategory.C1E,
    TestCategory.CM,
    TestCategory.C1M,
    TestCategory.CEM,
    TestCategory.C1EM,
    TestCategory.DM,
    TestCategory.D1M,
    TestCategory.DEM,
    TestCategory.D1EM,
    TestCategory.D,
    TestCategory.D1,
    TestCategory.DE,
    TestCategory.D1E,
    TestCategory.EUAMM1,
    TestCategory.EUA1M1,
    TestCategory.EUA2M1,
    TestCategory.EUAM1,
    TestCategory.EUAMM2,
    TestCategory.EUA1M2,
    TestCategory.EUA2M2,
    TestCategory.EUAM2,
    TestCategory.CCPC,
    TestCategory.DCPC,
    TestCategory.F,
    TestCategory.G,
    TestCategory.H,
    TestCategory.K,
  ]);

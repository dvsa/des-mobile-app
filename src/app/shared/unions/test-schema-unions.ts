import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';

import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { CatBEUniqueTypes } from '@dvsa/mes-test-schema/categories/BE';

import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { CatC1UniqueTypes } from '@dvsa/mes-test-schema/categories/C1';
import { CatCEUniqueTypes } from '@dvsa/mes-test-schema/categories/CE';
import { CatC1EUniqueTypes } from '@dvsa/mes-test-schema/categories/C1E';

import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { CatD1UniqueTypes } from '@dvsa/mes-test-schema/categories/D1';
import { CatDEUniqueTypes } from '@dvsa/mes-test-schema/categories/DE';
import { CatD1EUniqueTypes } from '@dvsa/mes-test-schema/categories/D1E';

import { CatFUniqueTypes } from '@dvsa/mes-test-schema/categories/F';
import { CatGUniqueTypes } from '@dvsa/mes-test-schema/categories/G';
import { CatHUniqueTypes } from '@dvsa/mes-test-schema/categories/H';
import { CatKUniqueTypes } from '@dvsa/mes-test-schema/categories/K';

// Vehicle Details
export type VehicleDetailsUnion =
  | CatBEUniqueTypes.VehicleDetails
  | CatCUniqueTypes.VehicleDetails
  | CatC1UniqueTypes.VehicleDetails
  | CatCEUniqueTypes.VehicleDetails
  | CatC1EUniqueTypes.VehicleDetails
  | CatDUniqueTypes.VehicleDetails
  | CatD1UniqueTypes.VehicleDetails
  | CatDEUniqueTypes.VehicleDetails
  | CatD1EUniqueTypes.VehicleDetails;

// Vehicle CHecks
export type VehicleChecksUnion =
  | CatFUniqueTypes.VehicleChecks
  | CatGUniqueTypes.VehicleChecks
  | CatHUniqueTypes.VehicleChecks
  | CatKUniqueTypes.VehicleChecks;

export type CatCVehicleChecks =
  | CatCUniqueTypes.VehicleChecks
  | CatC1UniqueTypes.VehicleChecks
  | CatCEUniqueTypes.VehicleChecks
  | CatC1EUniqueTypes.VehicleChecks;

export type CatDVehicleChecks =
  | CatDUniqueTypes.VehicleChecks
  | CatD1UniqueTypes.VehicleChecks
  | CatDEUniqueTypes.VehicleChecks
  | CatD1EUniqueTypes.VehicleChecks;

export type CatHomeTestVehicleChecks =
  | CatFUniqueTypes.VehicleChecks
  | CatGUniqueTypes.VehicleChecks
  | CatHUniqueTypes.VehicleChecks
  | CatKUniqueTypes.VehicleChecks;

// Controlled Stop
export type ControlledStopUnion =
  | CatADI2UniqueTypes.ControlledStop
  | CatBUniqueTypes.ControlledStop
  | CatFUniqueTypes.ControlledStop
  | CatGUniqueTypes.ControlledStop
  | CatHUniqueTypes.ControlledStop
  | CatKUniqueTypes.ControlledStop;

// Highway Code
export type HighwayCodeSafetyUnion =
  | CatFUniqueTypes.HighwayCodeSafety
  | CatGUniqueTypes.HighwayCodeSafety
  | CatHUniqueTypes.HighwayCodeSafety
  | CatKUniqueTypes.HighwayCodeSafety;

// Manoeuvres
export type CatCManoeuvres =
  | CatCUniqueTypes.Manoeuvres
  | CatC1UniqueTypes.Manoeuvres
  | CatCEUniqueTypes.Manoeuvres
  | CatC1EUniqueTypes.Manoeuvres;

export type CatDManoeuvres =
  | CatDUniqueTypes.Manoeuvres
  | CatD1UniqueTypes.Manoeuvres
  | CatDEUniqueTypes.Manoeuvres
  | CatD1EUniqueTypes.Manoeuvres;

export type CatHomeTestManoeuvres =
  | CatFUniqueTypes.Manoeuvres
  | CatGUniqueTypes.Manoeuvres
  | CatHUniqueTypes.Manoeuvres;

export type ManoeuvreUnion =
  | CatBEUniqueTypes.Manoeuvres
  | CatCUniqueTypes.Manoeuvres
  | CatC1UniqueTypes.Manoeuvres
  | CatCEUniqueTypes.Manoeuvres
  | CatC1EUniqueTypes.Manoeuvres
  | CatDUniqueTypes.Manoeuvres
  | CatD1UniqueTypes.Manoeuvres
  | CatDEUniqueTypes.Manoeuvres
  | CatD1EUniqueTypes.Manoeuvres
  | CatFUniqueTypes.Manoeuvres
  | CatGUniqueTypes.Manoeuvres
  | CatHUniqueTypes.Manoeuvres;

// Test Requirements
export type CatCTestRequirements =
  | CatCUniqueTypes.TestRequirements
  | CatC1UniqueTypes.TestRequirements
  | CatCEUniqueTypes.TestRequirements
  | CatC1EUniqueTypes.TestRequirements;

export type CatDTestRequirements =
  | CatDUniqueTypes.TestRequirements
  | CatD1UniqueTypes.TestRequirements
  | CatDEUniqueTypes.TestRequirements
  | CatD1EUniqueTypes.TestRequirements;

export type HomeTestRequirements =
  | CatFUniqueTypes.TestRequirements
  | CatGUniqueTypes.TestRequirements
  | CatHUniqueTypes.TestRequirements
  | CatKUniqueTypes.TestRequirements;

// Test Data
export type TestDataUnion =
  | CatBUniqueTypes.TestData
  | CatBEUniqueTypes.TestData
  | CatCTestData
  | CatDTestData
  | CatHomeTestData;

export type CatCTestData =
  | CatCUniqueTypes.TestData
  | CatC1UniqueTypes.TestData
  | CatCEUniqueTypes.TestData
  | CatC1EUniqueTypes.TestData;

export type CatDTestData =
  | CatDUniqueTypes.TestData
  | CatD1UniqueTypes.TestData
  | CatDEUniqueTypes.TestData
  | CatD1EUniqueTypes.TestData;

export type CatHomeTestData =
  | CatFUniqueTypes.TestData
  | CatGUniqueTypes.TestData
  | CatHUniqueTypes.TestData
  | CatKUniqueTypes.TestData;

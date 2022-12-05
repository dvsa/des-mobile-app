export interface VehicleDetails {
  timeStamp: string;
  vehicle: Vehicle;
}

export interface Vehicle {
  co2Emissions: number;
  colour: string;
  engineCapacity: number;
  fuelType: string;
  make: string;
  markedForExport: boolean;
  monthOfFirstRegistration: string;
  motExpiryDate: string;
  motStatus: string;
  registrationNumber: string;
  revenueWeight: number;
  taxDueDate: string;
  artEndDate?: any;
  taxStatus: string;
  typeApproval: string;
  wheelplan: string;
  yearOfManufacture: string;
}

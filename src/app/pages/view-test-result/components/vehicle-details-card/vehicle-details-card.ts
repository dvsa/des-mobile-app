import { Component, Input } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { get } from 'lodash';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { CatBEUniqueTypes } from '@dvsa/mes-test-schema/categories/BE';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { CatCEUniqueTypes } from '@dvsa/mes-test-schema/categories/CE';
import { CatC1UniqueTypes } from '@dvsa/mes-test-schema/categories/C1';
import { CatC1EUniqueTypes } from '@dvsa/mes-test-schema/categories/C1E';
import * as CatAMod1Types from '@dvsa/mes-test-schema/categories/AM1';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { flattenArray } from '@pages/view-test-result/view-test-result-helpers';

@Component({
  selector: 'vehicle-details-card',
  templateUrl: 'vehicle-details-card.html',
  styleUrls: ['vehicle-details-card.scss'],
})
export class VehicleDetailsCardComponent {

  @Input()
  data: CatBUniqueTypes.VehicleDetails
  | CatBEUniqueTypes.VehicleDetails
  | CatCUniqueTypes.VehicleDetails
  | CatCEUniqueTypes.VehicleDetails
  | CatC1UniqueTypes.VehicleDetails
  | CatC1EUniqueTypes.VehicleDetails
  | CatADI2UniqueTypes.VehicleDetails
  | CatAMod1Types.VehicleDetails;

  @Input()
  category: TestCategory | CategoryCode;

  @Input()
  passCompletion?: CatCUniqueTypes.PassCompletion = null;

  @Input()
  trainerData: CatADI2UniqueTypes.TrainerDetails;

  @Input()
  vehicleDetails: string[] = [];

  public shouldHideCard() : boolean {
    return (
      !this.getTransmission()
        && !this.getRegistrationNumber()
        && !this.getSchoolBike()
        && !this.getInstructorRegistrationNumber()
    );
  }

  public shouldHideDimensions() : boolean {
    switch (this.category) {
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
      case TestCategory.K:
        return true;
      default:
        return false;
    }
  }

  public showTransmissionWithCode78() : boolean {
    switch (this.category) {
      case TestCategory.BE:
      case TestCategory.C:
      case TestCategory.C1:
      case TestCategory.CE:
      case TestCategory.C1E:
      case TestCategory.D:
      case TestCategory.D1:
      case TestCategory.DE:
      case TestCategory.D1E:
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
      case TestCategory.K:
        return true;
      default:
        return false;
    }
  }

  public getInstructorRegistrationNumber(): number {
    return get(this.data, 'instructorRegistrationNumber');
  }

  public getTransmission(): string {
    return get(this.data, 'gearboxCategory');
  }

  public getRegistrationNumber(): string {
    return get(this.data, 'registrationNumber');
  }

  public getVehicleLength(): string {
    return get(this.data, 'vehicleLength', '?').toString();
  }

  public getVehicleWidth(): string {
    return get(this.data, 'vehicleWidth', '?').toString();
  }

  public getSchoolBike(): boolean {
    return get(this.data, 'schoolBike');
  }

  public getTrainerPRN(): number {
    return get(this.trainerData, 'trainerRegistrationNumber', null);
  }

  public getOrdit(): string {
    return get(this.trainerData, 'orditTrainedCandidate', false) ? 'Yes' : 'No';
  }

  public getTrainingRecords(): string {
    return get(this.trainerData, 'trainingRecords', false) ? 'Yes' : 'No';
  }

  public displayVehicleDetails(): boolean {
    return get(this.data, 'schoolCar', false) || get(this.data, 'dualControls', false);
  }

  public getVehicleDetails(): string {
    return get(this.data, 'schoolCar') ? 'School Car' : 'Dual Controls';
  }

  getFlattenArray = (data: string[]): string => flattenArray(data);
}

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DataRowCustomComponent } from '@components/common/data-row-custom/data-row-custom';
import { DataRowComponent } from '@components/common/data-row/data-row';
import { TransmissionDisplayComponent } from '@components/common/transmission-display/transmission-display';
import { CatCMUniqueTypes } from '@dvsa/mes-test-schema/categories/CM';
import { VehicleDetails } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonicModule } from '@ionic/angular';
import { MotStatusCodes } from '@providers/mot-history-api/mot-interfaces';
import { MockComponent } from 'ng-mocks';
import { VehicleDetailsCardComponent } from '../vehicle-details-card';

describe('VehicleDetailsCardComponent', () => {
  let fixture: ComponentFixture<VehicleDetailsCardComponent>;
  let component: VehicleDetailsCardComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleDetailsCardComponent,
        MockComponent(DataRowComponent),
        MockComponent(DataRowCustomComponent),
        MockComponent(TransmissionDisplayComponent),
      ],
      imports: [IonicModule],
    });

    fixture = TestBed.createComponent(VehicleDetailsCardComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('shouldShowDimensions', () => {
      const localCategories = [
        {
          category: TestCategory.F,
          outcome: false,
        },
        {
          category: TestCategory.G,
          outcome: false,
        },
        {
          category: TestCategory.H,
          outcome: false,
        },
        {
          category: TestCategory.K,
          outcome: false,
        },
        {
          category: TestCategory.BE,
          outcome: true,
        },
      ];
      localCategories.forEach(({ category, outcome }) => {
        it(`should ${outcome ? 'hide' : 'not hide'} for cat ${category}`, () => {
          component.category = category as TestCategory;
          expect(component.shouldShowDimensions).toEqual(outcome);
        });
      });
    });
    describe('shouldHideCard', () => {
      it('should return true if all queries return nothing', () => {
        spyOnProperty(component, 'transmission').and.returnValue(null);
        spyOnProperty(component, 'registrationNumber').and.returnValue(null);
        spyOn(component, 'getPreviousFilteredVRNs').and.returnValue(null);
        spyOnProperty(component, 'schoolBike').and.returnValue(null);
        spyOnProperty(component, 'instructorRegistrationNumber').and.returnValue(null);

        expect(component.shouldHideCard()).toEqual(true);
      });
      it('should return false if there is a gearbox category', () => {
        spyOn(component, 'getPreviousFilteredVRNs').and.returnValue(null);
        spyOnProperty(component, 'transmission').and.returnValue('Tests');
        expect(component.shouldHideCard()).toEqual(false);
      });
      it('should return false if there is a vehicle registration number', () => {
        spyOn(component, 'getPreviousFilteredVRNs').and.returnValue(null);
        spyOnProperty(component, 'registrationNumber').and.returnValue('Tests');
        expect(component.shouldHideCard()).toEqual(false);
      });
      it('should return false if there is are previously searched registration numbers', () => {
        spyOn(component, 'getPreviousFilteredVRNs').and.returnValue(['1', '2', '3']);
        expect(component.shouldHideCard()).toEqual(false);
      });
      it('should return false if there is a instructor registration number', () => {
        spyOn(component, 'getPreviousFilteredVRNs').and.returnValue(null);
        spyOnProperty(component, 'instructorRegistrationNumber').and.returnValue(1);
        expect(component.shouldHideCard()).toEqual(false);
      });
    });
    describe('getTransmission', () => {
      it('should return the correct value', () => {
        component.data = {
          gearboxCategory: 'Manual',
        } as VehicleDetails;
        fixture.detectChanges();
        expect(component.transmission).toEqual('Manual');
      });
      it('should return undefined if the data is missing', () => {
        expect(component.transmission).toEqual(undefined);
      });
    });
    describe('getRegistrationNumber', () => {
      it('should return the correct value', () => {
        component.data = {
          registrationNumber: 'ABC 1234',
        } as VehicleDetails;
        fixture.detectChanges();
        expect(component.registrationNumber).toEqual('ABC 1234');
      });
      it('should return undefined if the data is missing', () => {
        expect(component.registrationNumber).toEqual(undefined);
      });
    });

    describe('getFlattenArray', () => {
      it('should return a flattened array', () => {
        expect(component.getFlattenArray(['1', '2', '3'])).toEqual('1, 2 and 3');
      });
    });

    describe('vehicleHeight', () => {
      it('should vehicleHeight as a string', () => {
        component.data = { vehicleHeight: 1 } as CatCMUniqueTypes.VehicleDetails;
        expect(component.vehicleHeight).toEqual('1');
      });
    });

    describe('numberOfSeats', () => {
      it('should numberOfSeats as a string', () => {
        component.data = { numberOfSeats: 1 } as CatCMUniqueTypes.VehicleDetails;
        expect(component.numberOfSeats).toEqual('1');
      });
    });

    describe('schoolBike', () => {
      it('should return Yes if orditTrainedCandidate and isBike is trie', () => {
        spyOn(component, 'isBike').and.returnValue(true);
        component.data = { schoolBike: true };
        expect(component.schoolBike).toEqual('Yes');
      });
      it('should return No if orditTrainedCandidate is false and isBike is true', () => {
        spyOn(component, 'isBike').and.returnValue(true);
        component.data = { schoolBike: false };
        expect(component.schoolBike).toEqual('No');
      });
      it('should return null if isBike is false', () => {
        spyOn(component, 'isBike').and.returnValue(false);
        expect(component.schoolBike).toEqual(null);
      });
    });

    describe('ordit', () => {
      it('should return Yes if orditTrainedCandidate is true', () => {
        component.trainerData = { orditTrainedCandidate: true };
        expect(component.ordit).toEqual('Yes');
      });
      it('should return No if orditTrainedCandidate is false', () => {
        component.trainerData = { orditTrainedCandidate: false };
        expect(component.ordit).toEqual('No');
      });
    });

    describe('trainingRecords', () => {
      it('should return Yes if orditTrainedCandidate is true', () => {
        component.trainerData = { trainingRecords: true };
        expect(component.trainingRecords).toEqual('Yes');
      });
      it('should return No if orditTrainedCandidate is false', () => {
        component.trainerData = { trainingRecords: false };
        expect(component.trainingRecords).toEqual('No');
      });
    });

    describe('dualControls', () => {
      it('should return No if schoolCar is true', () => {
        component.data = { schoolCar: true };
        expect(component.dualControls).toEqual('No');
      });
      it('should return Yes if schoolCar is false', () => {
        component.data = { schoolCar: false };
        expect(component.dualControls).toEqual('Yes');
      });
    });

    describe('schoolCarDualControls', () => {
      it('should return School car if schoolCar is true', () => {
        component.data = { schoolCar: true };
        expect(component.schoolCarDualControls).toEqual('School car');
      });
      it('should return Dual Controls if schoolCar is false', () => {
        component.data = { schoolCar: false };
        expect(component.schoolCarDualControls).toEqual('Dual controls');
      });
    });

    describe('showTransmissionWithCode78', () => {
      [
        TestCategory.BE,
        TestCategory.C,
        TestCategory.C1,
        TestCategory.CE,
        TestCategory.C1E,
        TestCategory.D,
        TestCategory.D1,
        TestCategory.DE,
        TestCategory.D1E,
        TestCategory.F,
        TestCategory.G,
        TestCategory.H,
        TestCategory.K,
      ].forEach((val) => {
        it(`should return true if the category is ${val}`, () => {
          component.category = val;
          expect(component.showTransmissionWithCode78).toEqual(true);
        });
      });
      it('should return false if the switch defaults', () => {
        component.category = TestCategory.B;
        expect(component.showTransmissionWithCode78).toEqual(false);
      });
    });

    describe('displayVehicleDetailsSeparator', () => {
      it('should return true if instructorRegistrationNumber is defined', () => {
        spyOnProperty(component, 'instructorRegistrationNumber').and.returnValue(12345);
        expect(component.displayVehicleDetailsSeparator).toBeTruthy();
      });

      it('should return true if shouldShowDimensions is true', () => {
        spyOnProperty(component, 'shouldShowDimensions').and.returnValue(true);
        expect(component.displayVehicleDetailsSeparator).toBeTruthy();
      });

      it('should return true if schoolBike is defined', () => {
        spyOnProperty(component, 'schoolBike').and.returnValue('Yes');
        expect(component.displayVehicleDetailsSeparator).toBeTruthy();
      });

      it('should return true if trainerPRN is defined and is not ADI3', () => {
        spyOn(component, 'isADI3').and.returnValue(false);
        spyOnProperty(component, 'trainerPRN').and.returnValue(12345);
        expect(component.displayVehicleDetailsSeparator).toBeTruthy();
      });

      it('should return true if isADI2 is true', () => {
        spyOn(component, 'isADI2').and.returnValue(true);
        expect(component.displayVehicleDetailsSeparator).toBeTruthy();
      });

      it('should return true if isADI3 is true', () => {
        spyOn(component, 'isADI3').and.returnValue(true);
        expect(component.displayVehicleDetailsSeparator).toBeTruthy();
      });

      it('should return false if all conditions are false or undefined', () => {
        spyOnProperty(component, 'instructorRegistrationNumber').and.returnValue(undefined);
        spyOnProperty(component, 'shouldShowDimensions').and.returnValue(false);
        spyOnProperty(component, 'schoolBike').and.returnValue(undefined);
        spyOn(component, 'isADI3').and.returnValue(false);
        spyOn(component, 'isADI2').and.returnValue(false);
        spyOnProperty(component, 'trainerPRN').and.returnValue(undefined);
        expect(component.displayVehicleDetailsSeparator).toBeFalsy();
      });
    });

    describe('showInstructorRegistrationNumberSeparator', () => {
      it('returns true if shouldShowDimensions is true', () => {
        spyOnProperty(component, 'shouldShowDimensions').and.returnValue(true);
        expect(component.showInstructorRegistrationNumberSeparator).toBeTruthy();
      });

      it('returns true if schoolBike is defined', () => {
        spyOnProperty(component, 'schoolBike').and.returnValue('Yes');
        expect(component.showInstructorRegistrationNumberSeparator).toBeTruthy();
      });

      it('returns true if isADI2 is true', () => {
        spyOn(component, 'isADI2').and.returnValue(true);
        expect(component.showInstructorRegistrationNumberSeparator).toBeTruthy();
      });

      it('returns true if isADI3 is true', () => {
        spyOn(component, 'isADI3').and.returnValue(true);
        expect(component.showInstructorRegistrationNumberSeparator).toBeTruthy();
      });

      it('returns true if trainerPRN is defined and isADI3 is false', () => {
        spyOn(component, 'isADI3').and.returnValue(false);
        spyOnProperty(component, 'trainerPRN').and.returnValue(12345);
        expect(component.showInstructorRegistrationNumberSeparator).toBeTruthy();
      });

      it('returns false if all conditions are false or undefined', () => {
        spyOnProperty(component, 'shouldShowDimensions').and.returnValue(false);
        spyOnProperty(component, 'schoolBike').and.returnValue(undefined);
        spyOn(component, 'isADI2').and.returnValue(false);
        spyOn(component, 'isADI3').and.returnValue(false);
        spyOnProperty(component, 'trainerPRN').and.returnValue(undefined);
        expect(component.showInstructorRegistrationNumberSeparator).toBeFalsy();
      });
    });

    describe('showRegistrationNumberSeparator', () => {
      it('returns true if isADI2 is true', () => {
        spyOn(component, 'isADI2').and.returnValue(true);
        expect(component.showRegistrationNumberSeparator).toBeTruthy();
      });

      it('returns true if isADI3 is true', () => {
        spyOn(component, 'isADI3').and.returnValue(true);
        expect(component.showRegistrationNumberSeparator).toBeTruthy();
      });

      it('returns true if trainerPRN is defined and isADI3 is false', () => {
        spyOn(component, 'isADI3').and.returnValue(false);
        spyOnProperty(component, 'trainerPRN').and.returnValue(12345);
        expect(component.showRegistrationNumberSeparator).toBeTruthy();
      });

      it('returns true if schoolBike is defined', () => {
        spyOnProperty(component, 'schoolBike').and.returnValue('Yes');
        expect(component.showRegistrationNumberSeparator).toBeTruthy();
      });

      it('returns true if displayRegistration is true', () => {
        spyOn(component, 'displayRegistration').and.returnValue(true);
        expect(component.showRegistrationNumberSeparator).toBeTruthy();
      });

      it('returns true if vehicleDetails is defined', () => {
        component.vehicleDetails = ['detail1', 'detail2'];
        expect(component.showRegistrationNumberSeparator).toBeTruthy();
      });

      it('returns false if all conditions are false or undefined', () => {
        spyOn(component, 'isADI2').and.returnValue(false);
        spyOn(component, 'isADI3').and.returnValue(false);
        spyOnProperty(component, 'trainerPRN').and.returnValue(undefined);
        spyOnProperty(component, 'schoolBike').and.returnValue(undefined);
        spyOn(component, 'displayRegistration').and.returnValue(false);
        component.vehicleDetails = undefined;
        expect(component.showRegistrationNumberSeparator).toBeFalsy();
      });
    });

    describe('shouldShowDimensionsSeparator', () => {
      it('returns true if isADI2 is true', () => {
        spyOn(component, 'isADI2').and.returnValue(true);
        expect(component.shouldShowDimensionsSeparator).toBeTruthy();
      });

      it('returns true if schoolBike is defined', () => {
        spyOnProperty(component, 'schoolBike').and.returnValue('Yes');
        expect(component.shouldShowDimensionsSeparator).toBeTruthy();
      });

      it('returns true if isADI3 is true', () => {
        spyOn(component, 'isADI3').and.returnValue(true);
        expect(component.shouldShowDimensionsSeparator).toBeTruthy();
      });

      it('returns true if trainerPRN is defined and isADI3 is false', () => {
        spyOn(component, 'isADI3').and.returnValue(false);
        spyOnProperty(component, 'trainerPRN').and.returnValue(12345);
        expect(component.shouldShowDimensionsSeparator).toBeTruthy();
      });

      it('returns false if all conditions are false or undefined', () => {
        spyOn(component, 'isADI2').and.returnValue(false);
        spyOn(component, 'isADI3').and.returnValue(false);
        spyOnProperty(component, 'schoolBike').and.returnValue(undefined);
        spyOnProperty(component, 'trainerPRN').and.returnValue(undefined);
        expect(component.shouldShowDimensionsSeparator).toBeFalsy();
      });
    });

    describe('shouldShowExtraDimensions', () => {
      [
        TestCategory.CM,
        TestCategory.C1M,
        TestCategory.CEM,
        TestCategory.C1EM,
        TestCategory.DM,
        TestCategory.D1M,
        TestCategory.DEM,
        TestCategory.D1EM,
      ].forEach((val) => {
        it(`should return true if the category is ${val}`, () => {
          component.category = val;
          expect(component.shouldShowExtraDimensions).toEqual(true);
        });
      });
      it('should return false if the switch defaults', () => {
        component.category = TestCategory.B;
        expect(component.shouldShowExtraDimensions).toEqual(false);
      });
    });

    describe('getVehicleLength', () => {
      it('should return the correct value', () => {
        component.data = {
          vehicleLength: 10,
        };
        fixture.detectChanges();
        expect(component.vehicleLength).toEqual('10');
      });
      it('should return ? if the data is missing', () => {
        expect(component.vehicleLength).toEqual('?');
      });
    });
    describe('getVehicleWidth', () => {
      it('should return the correct value', () => {
        component.data = {
          vehicleWidth: 4,
        };
        fixture.detectChanges();
        expect(component.vehicleWidth).toEqual('4');
      });
      it('should return ? if the data is missing', () => {
        expect(component.vehicleWidth).toEqual('?');
      });
    });

    describe('displayRegistration', () => {
      it('should return the correct value if the category is ADI3', () => {
        spyOn(component, 'isADI3').and.returnValue(true);
        spyOnProperty(component, 'registrationNumber').and.returnValue(undefined);
        spyOnProperty(component, 'shouldShowDimensions').and.returnValue(false);
        component.vehicleDetails = undefined;
        expect(component.displayRegistration).toBeTruthy();
      });
      it('should return the correct value if the registration number is present', () => {
        spyOn(component, 'isADI3').and.returnValue(false);
        spyOnProperty(component, 'registrationNumber').and.returnValue('1');
        spyOnProperty(component, 'shouldShowDimensions').and.returnValue(false);
        component.vehicleDetails = undefined;
        expect(component.displayRegistration).toBeTruthy();
      });
      it('should return the correct value if should show dimensions is true', () => {
        spyOn(component, 'isADI3').and.returnValue(false);
        spyOnProperty(component, 'registrationNumber').and.returnValue(undefined);
        spyOnProperty(component, 'shouldShowDimensions').and.returnValue(true);
        component.vehicleDetails = undefined;
        expect(component.displayRegistration).toBeTruthy();
      });
      it('should return the correct value if vehicle details is defined', () => {
        spyOn(component, 'isADI3').and.returnValue(false);
        spyOnProperty(component, 'registrationNumber').and.returnValue(undefined);
        spyOnProperty(component, 'shouldShowDimensions').and.returnValue(false);
        component.vehicleDetails = ['d', 'e', 'f', 'i', 'n', 'e', 'd'];
        expect(component.displayRegistration).toBeTruthy();
      });
      it('should return the correct value if nothing is defined', () => {
        spyOn(component, 'isADI3').and.returnValue(false);
        spyOnProperty(component, 'registrationNumber').and.returnValue(undefined);
        spyOnProperty(component, 'shouldShowDimensions').and.returnValue(false);
        component.vehicleDetails = undefined;
        expect(component.displayRegistration)!.toBeTruthy();
      });
    });

    describe('getMotStatusText', () => {
      it('returns "Valid until {testExpiryDate}" if motStatus is VALID and testExpiryDate is available', () => {
        component.data = { motStatus: MotStatusCodes.VALID, testExpiryDate: '2023-12-31' };
        expect(component.getMotStatusText()).toEqual('Valid until 2023-12-31');
      });

      it('returns "Valid" if motStatus is VALID and testExpiryDate is not available', () => {
        component.data = { motStatus: MotStatusCodes.VALID };
        expect(component.getMotStatusText()).toEqual('Valid');
      });

      it('returns motStatus text directly if motStatus is not invalid', () => {
        component.data = { motStatus: 'SomeStatus' };
        spyOn(component, 'isInvalidMOT').and.returnValue(false);
        expect(component.getMotStatusText()).toEqual('SomeStatus');
      });

      it('returns "Expired {testExpiryDate}" if motStatus is invalid and testExpiryDate is available', () => {
        component.data = { motStatus: MotStatusCodes.NOT_VALID, testExpiryDate: '2023-12-31' };
        expect(component.getMotStatusText()).toEqual('Expired 2023-12-31');
      });

      it('returns "Not valid" if motStatus is invalid and testExpiryDate is not available', () => {
        component.data = { motStatus: MotStatusCodes.NOT_VALID };
        expect(component.getMotStatusText()).toEqual('Not valid');
      });
    });

    describe('getPreviousFilteredVRNs', () => {
      it('returns an empty array if previouslySearchedRegNumbers is not defined', () => {
        component.data = {};
        expect(component.getPreviousFilteredVRNs()).toEqual([]);
      });

      it('returns an empty array if previouslySearchedRegNumbers is empty', () => {
        component.data = { previouslySearchedRegNumbers: [] };
        expect(component.getPreviousFilteredVRNs()).toEqual([]);
      });

      it('returns previouslySearchedRegNumbers excluding the current registration number', () => {
        component.data = {
          previouslySearchedRegNumbers: ['ABC123', 'XYZ789'],
          registrationNumber: 'ABC123',
        };
        expect(component.getPreviousFilteredVRNs()).toEqual(['XYZ789']);
      });

      it('returns previouslySearchedRegNumbers without duplicates', () => {
        component.data = {
          previouslySearchedRegNumbers: ['ABC123', 'XYZ789', 'ABC123'],
          registrationNumber: 'DEF456',
        };
        expect(component.getPreviousFilteredVRNs()).toEqual(['ABC123', 'XYZ789']);
      });

      it('returns previouslySearchedRegNumbers if no current registration number is set', () => {
        component.data = {
          previouslySearchedRegNumbers: ['ABC123', 'XYZ789'],
        };
        expect(component.getPreviousFilteredVRNs()).toEqual(['ABC123', 'XYZ789']);
      });
    });

    describe('isInvalidMOT', () => {
      it('returns true if motStatus is NOT_VALID', () => {
        component.data = { motStatus: MotStatusCodes.NOT_VALID };
        expect(component.isInvalidMOT()).toEqual(true);
      });

      it('returns false if motStatus is VALID', () => {
        component.data = { motStatus: MotStatusCodes.VALID };
        expect(component.isInvalidMOT()).toEqual(false);
      });

      it('returns false if motStatus is undefined', () => {
        component.data = {};
        expect(component.isInvalidMOT()).toEqual(false);
      });

      it('returns false if data is undefined', () => {
        component.data = undefined;
        expect(component.isInvalidMOT()).toEqual(false);
      });
    });

    describe('getNoMOTDataText', () => {
      it('returns the correct text when registration number is available', () => {
        spyOnProperty(component, 'registrationNumber').and.returnValue('ABC123');
        expect(component.getNoMOTDataText()).toEqual('Unable to determine MOT status for ABC123');
      });

      it('returns the correct text when there are previously filtered VRNs but no registration number', () => {
        spyOnProperty(component, 'registrationNumber').and.returnValue(null);
        spyOn(component, 'getPreviousFilteredVRNs').and.returnValue(['XYZ789']);
        expect(component.getNoMOTDataText()).toEqual('Unable to determine MOT status');
      });

      it('returns the correct text when there are no previously filtered VRNs and no registration number', () => {
        spyOnProperty(component, 'registrationNumber').and.returnValue(null);
        spyOn(component, 'getPreviousFilteredVRNs').and.returnValue([]);
        expect(component.getNoMOTDataText()).toEqual('No VRNs were checked for MOT');
      });
    });
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { VehicleDetails } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { DataRowComponent } from '@components/common/data-row/data-row';
import { DataRowCustomComponent } from '@components/common/data-row-custom/data-row-custom';
import { TransmissionDisplayComponent } from '@components/common/transmission-display/transmission-display';
import { CatCMUniqueTypes } from '@dvsa/mes-test-schema/categories/CM';
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
      imports: [
        IonicModule,
      ],
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
      localCategories.forEach(({
        category,
        outcome,
      }) => {
        it(`should ${outcome ? 'hide' : 'not hide'} for cat ${category}`, () => {
          component.category = category as TestCategory;
          expect(component.shouldShowDimensions).toEqual(outcome);
        });
      });
    });
    describe('shouldHideCard', () => {
      it('should return true if the data is missing', () => {
        expect(component.shouldHideCard()).toEqual(true);
      });
      it('should return false if there is a gearbox category', () => {
        spyOnProperty(component, 'transmission').and.returnValue('Tests');
        expect(component.shouldHideCard()).toEqual(false);
      });
      it('should return false if there is a vehicle registration number', () => {
        spyOnProperty(component, 'registrationNumber').and.returnValue('Tests');
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
      it('should return School Car if schoolCar is true', () => {
        component.data = { schoolCar: true };
        expect(component.schoolCarDualControls).toEqual('School Car');
      });
      it('should return Dual Controls if schoolCar is false', () => {
        component.data = { schoolCar: false };
        expect(component.schoolCarDualControls).toEqual('Dual Controls');
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
  });
});

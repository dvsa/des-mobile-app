import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { VehicleDetails } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { configureTestSuite } from 'ng-bullet';
import { DataRowComponent } from '@components/common/data-row/data-row';
import { DataRowCustomComponent } from '@components/common/data-row-custom/data-row-custom';
import { TransmissionDisplayComponent } from '@components/common/transmission-display/transmission-display';
import { VehicleDetailsCardComponent } from '../vehicle-details-card';

describe('VehicleDetailsCardComponent', () => {
  let fixture: ComponentFixture<VehicleDetailsCardComponent>;
  let component: VehicleDetailsCardComponent;

  configureTestSuite(() => {
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
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(VehicleDetailsCardComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('shouldShowDimensions', () => {
      const localCategories = [
        { category: TestCategory.F, outcome: false },
        { category: TestCategory.G, outcome: false },
        { category: TestCategory.H, outcome: false },
        { category: TestCategory.K, outcome: false },
        { category: TestCategory.BE, outcome: true },
      ];
      localCategories.forEach(({ category, outcome }) => {
        it(`should ${outcome ? 'hide' : 'not hide'} for cat ${category}`, () => {
          component.category = category as TestCategory;
          expect(component.shouldShowDimensions()).toEqual(outcome);
        });
      });
    });
    describe('shouldHideCard', () => {
      it('should return true if the data is missing', () => {
        expect(component.shouldHideCard()).toEqual(true);
      });
      it('should return false if there is a gearbox category', () => {
        spyOn(component, 'getTransmission').and.returnValue('Tests');
        expect(component.shouldHideCard()).toEqual(false);
      });
      it('should return false if there is a vehicle registration number', () => {
        spyOn(component, 'getRegistrationNumber').and.returnValue('Tests');
        expect(component.shouldHideCard()).toEqual(false);
      });
    });
    describe('getTransmission', () => {
      it('should return the correct value', () => {
        const data: VehicleDetails = {
          gearboxCategory: 'Manual',
        };
        component.data = data;
        fixture.detectChanges();
        expect(component.getTransmission()).toEqual('Manual');
      });
      it('should return undefined if the data is missing', () => {
        expect(component.getTransmission()).toEqual(undefined);
      });
    });
    describe('getRegistrationNumber', () => {
      it('should return the correct value', () => {
        const data: VehicleDetails = {
          registrationNumber: 'ABC 1234',
        };
        component.data = data;
        fixture.detectChanges();
        expect(component.getRegistrationNumber()).toEqual('ABC 1234');
      });
      it('should return undefined if the data is missing', () => {
        expect(component.getRegistrationNumber()).toEqual(undefined);
      });
    });
    describe('getVehicleLength', () => {
      it('should return the correct value', () => {
        component.data = {
          vehicleLength: 10,
        };
        fixture.detectChanges();
        expect(component.getVehicleLength()).toEqual('10');
      });
      it('should return ? if the data is missing', () => {
        expect(component.getVehicleLength()).toEqual('?');
      });
    });
    describe('getVehicleWidth', () => {
      it('should return the correct value', () => {
        component.data = {
          vehicleWidth: 4,
        };
        fixture.detectChanges();
        expect(component.getVehicleWidth()).toEqual('4');
      });
      it('should return ? if the data is missing', () => {
        expect(component.getVehicleWidth()).toEqual('?');
      });
    });
  });
});

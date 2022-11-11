import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { DataRowComponent } from '@components/common/data-row/data-row';
import { DataRowCustomComponent } from '@components/common/data-row-custom/data-row-custom';
import { DisplayAddressComponent } from '@components/common/display-address/display-address';
import { BusinessDetailsCardComponent, CandidateWithBusinessDetails } from '../business-details-card';

describe('BusinessDetailsCardComponent', () => {
  let fixture: ComponentFixture<BusinessDetailsCardComponent>;
  let component: BusinessDetailsCardComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        BusinessDetailsCardComponent,
        MockComponent(DataRowComponent),
        MockComponent(DataRowCustomComponent),
        MockComponent(DisplayAddressComponent),
      ],
      imports: [
        IonicModule,
      ],
    });

    fixture = TestBed.createComponent(BusinessDetailsCardComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('shouldHideCard', () => {
      it('should return true if all data is present', () => {
        component.data = null;
        fixture.detectChanges();
        expect(component.shouldHideCard()).toEqual(true);
      });
      it('should return false if all data has been provided', () => {
        const data: CandidateWithBusinessDetails = {
          businessName: 'Business Name',
          businessTelephone: ' Business Telephone',
          businessAddress: {
            addressLine1: 'Address Line 1',
          },
        };
        component.data = data;
        fixture.detectChanges();
        expect(component.shouldHideCard()).toEqual(false);
      });
      it('should return false if only business name has been provided', () => {
        const data: CandidateWithBusinessDetails = {
          businessName: 'Business Name',
        };
        component.data = data;
        fixture.detectChanges();
        expect(component.shouldHideCard()).toEqual(false);
      });
      it('should return false if only business telephone has been provided', () => {
        const data: CandidateWithBusinessDetails = {
          businessTelephone: ' Business Telephone',
        };
        component.data = data;
        fixture.detectChanges();
        expect(component.shouldHideCard()).toEqual(false);
      });
      it('should return false if only business address has been provided', () => {
        const data: CandidateWithBusinessDetails = {
          businessAddress: {
            addressLine1: 'Address Line 1',
          },
        };
        component.data = data;
        fixture.detectChanges();
        expect(component.shouldHideCard()).toEqual(false);
      });
    });
    describe('getBusinessName', () => {
      it('should return the correct value if the data is present', () => {
        const data: CandidateWithBusinessDetails = {
          businessName: 'Test Business Name',
        };
        component.data = data;
        fixture.detectChanges();
        expect(component.businessName).toEqual('Test Business Name');
      });
      it('should return Not Supplied if the data is not present', () => {
        expect(component.businessName).toEqual('Not supplied');
      });
    });
    describe('getPhoneNumber', () => {
      it('should return the correct value if the data is present', () => {
        const data: CandidateWithBusinessDetails = {
          businessTelephone: '123456789',
        };
        component.data = data;
        fixture.detectChanges();
        expect(component.phoneNumber).toEqual('123456789');
      });
      it('should return Not Supplied if the data is not present', () => {
        expect(component.phoneNumber).toEqual('Not supplied');
      });
    });
    describe('getAddress', () => {
      it('should return the correct value if the data is present', () => {
        const data: CandidateWithBusinessDetails = {
          businessAddress: {
            addressLine1: 'Address Line 1',
            addressLine2: 'Address Line 2',
            addressLine3: 'Address Line 3',
            addressLine4: 'Address Line 4',
            addressLine5: 'Address Line 5',
            postcode: 'Postcode',
          },
        };
        component.data = data;
        fixture.detectChanges();
        expect(component.address).toEqual(data.businessAddress);
      });
      it('should return undefined if the data is missing', () => {
        expect(component.address).toEqual(undefined);
      });
    });
  });

});

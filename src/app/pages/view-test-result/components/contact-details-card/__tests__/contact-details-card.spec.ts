import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { DataRowComponent } from '@components/common/data-row/data-row';
import { DataRowCustomComponent } from '@components/common/data-row-custom/data-row-custom';
import { CommunicationPreferences, Candidate } from '@dvsa/mes-test-schema/categories/common';
import { DisplayAddressComponent } from '@components/common/display-address/display-address';
import { HeaderComponent } from '@components/common/header-component/header.component';
import { ContactDetailsCardComponent } from '../contact-details-card';

describe('ContactDetailsCardComponent', () => {
  let fixture: ComponentFixture<ContactDetailsCardComponent>;
  let component: ContactDetailsCardComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContactDetailsCardComponent,
        MockComponent(HeaderComponent),
        MockComponent(DataRowComponent),
        MockComponent(DataRowCustomComponent),
        MockComponent(DisplayAddressComponent),
      ],
      imports: [
        IonicModule,
      ],
    });

    fixture = TestBed.createComponent(ContactDetailsCardComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('getTestResultPreference', () => {
      it('should return the correct data', () => {
        component.communicationPreferencesData = {
          communicationMethod: 'Email',
          updatedEmail: '',
          conductedLanguage: 'English',
        };
        fixture.detectChanges();
        expect(component.testResultPreference).toEqual('Email');
      });
      it('should return None if the data is missing', () => {
        expect(component.testResultPreference).toEqual('None');
      });
    });
    describe('getPhoneNumber', () => {
      it('should return the correct data', () => {
        component.candidateData = {
          primaryTelephone: 'Test Phone Number',
        };
        fixture.detectChanges();
        expect(component.phoneNumber).toEqual('Test Phone Number');
      });
      it('should return None if the data is missing', () => {
        expect(component.phoneNumber).toEqual('None');
      });
    });
    describe('oldEmailAddress', () => {
      it('should show the email address from the journal data if it is present', () => {
        component.candidateData = {
          emailAddress: 'Test@Test.com',
        };
        fixture.detectChanges();
        expect(component.oldEmailAddress).toEqual('Test@Test.com');
      });
      it('should show none when there is no data', () => {
        expect(component.oldEmailAddress).toEqual('None');
      });
    });
    describe('newEmailAddress', () => {
      it('should return "Same as booking email" if updatedEmail does not exist', () => {
        component.communicationPreferencesData = { } as CommunicationPreferences;
        expect(component.newEmailAddress).toEqual('Same as booking email');
      });
      it('should return "Same as booking email" if updatedEmail is the same as emailAddress', () => {
        component.communicationPreferencesData = { updatedEmail: 'test' } as CommunicationPreferences;
        component.candidateData = { emailAddress: 'test' } as Candidate;
        expect(component.newEmailAddress).toEqual('Same as booking email');
      });
      it('should return updatedEmail if updatedEmail is not the same as emailAddress', () => {
        component.communicationPreferencesData = { updatedEmail: 'test1' } as CommunicationPreferences;
        component.candidateData = { emailAddress: 'test' } as Candidate;
        expect(component.newEmailAddress).toEqual(component.communicationPreferencesData.updatedEmail);
      });
    });
    describe('getAddress', () => {
      it('should return the correct data', () => {
        const data: Candidate = {
          candidateAddress: {
            addressLine1: 'Test1',
            addressLine2: 'Test2',
            addressLine3: 'Test3',
            addressLine4: 'Test4',
            addressLine5: 'Test5',
            postcode: 'Test6',
          },
        };
        component.candidateData = data;
        fixture.detectChanges();
        expect(component.address).toEqual(data.candidateAddress);
      });
      it('should return undefined if there is no data', () => {
        expect(component.address).toEqual(undefined);
      });
    });
  });

});

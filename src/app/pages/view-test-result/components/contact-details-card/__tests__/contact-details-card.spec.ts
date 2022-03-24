import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { DataRowComponent } from '@components/common/data-row/data-row';
import { DataRowCustomComponent } from '@components/common/data-row-custom/data-row-custom';
import { CommunicationPreferences, Candidate } from '@dvsa/mes-test-schema/categories/common';
import { DisplayAddressComponent } from '@components/common/display-address/display-address';
import { configureTestSuite } from 'ng-bullet';
import { ContactDetailsCardComponent } from '../contact-details-card';

describe('ContactDetailsCardComponent', () => {
  let fixture: ComponentFixture<ContactDetailsCardComponent>;
  let component: ContactDetailsCardComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContactDetailsCardComponent,
        MockComponent(DataRowComponent),
        MockComponent(DataRowCustomComponent),
        MockComponent(DisplayAddressComponent),
      ],
      imports: [
        IonicModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ContactDetailsCardComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('getTestResultPreference', () => {
      it('should return the correct data', () => {
        const data: CommunicationPreferences = {
          communicationMethod: 'Email',
          updatedEmail: '',
          conductedLanguage: 'English',
        };
        component.communicationPreferencesData = data;
        fixture.detectChanges();
        expect(component.testResultPreference).toEqual('Email');
      });
      it('should return None if the data is missing', () => {
        expect(component.testResultPreference).toEqual('None');
      });
    });
    describe('getPhoneNumber', () => {
      it('should return the correct data', () => {
        const data: Candidate = {
          primaryTelephone: 'Test Phone Number',
        };
        component.candidateData = data;
        fixture.detectChanges();
        expect(component.phoneNumber).toEqual('Test Phone Number');
      });
      it('should return None if the data is missing', () => {
        expect(component.phoneNumber).toEqual('None');
      });
    });
    describe('getEmailAddress', () => {
      it('should show the email address from the journal data if the comms meathod is not email', () => {
        const candidateData: Candidate = {
          emailAddress: 'Test@Test.com',
        };
        const commsData: CommunicationPreferences = {
          communicationMethod: 'Post',
          conductedLanguage: 'English',
          updatedEmail: 'not-this@test.com',
        };
        component.candidateData = candidateData;
        component.communicationPreferencesData = commsData;
        fixture.detectChanges();
        expect(component.emailAddress).toEqual('Test@Test.com');
      });
      it('should show the email address from the comms data if the comms meathod is email', () => {
        const candidateData: Candidate = {
          emailAddress: 'not-this@test.com',
        };
        const commsData: CommunicationPreferences = {
          communicationMethod: 'Email',
          conductedLanguage: 'English',
          updatedEmail: 'Test@Test.com',
        };
        component.candidateData = candidateData;
        component.communicationPreferencesData = commsData;
        fixture.detectChanges();
        expect(component.emailAddress).toEqual('Test@Test.com');
      });
      it('should show the email address from the journal data when there is no comms data', () => {
        const candidateData: Candidate = {
          emailAddress: 'Test@Test.com',
        };
        component.candidateData = candidateData;
        fixture.detectChanges();
        expect(component.emailAddress).toEqual('Test@Test.com');
      });
      it('should show none when there is no data', () => {
        expect(component.emailAddress).toEqual('None');
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

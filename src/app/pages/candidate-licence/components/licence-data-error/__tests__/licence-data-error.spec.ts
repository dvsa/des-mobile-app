import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { LicenceDataError } from '@pages/candidate-licence/components/licence-data-error/licence-data-error';

describe('LicenceDataError', () => {
  let fixture: ComponentFixture<LicenceDataError>;
  let component: LicenceDataError;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LicenceDataError],
      imports: [IonicModule],
    });

    fixture = TestBed.createComponent(LicenceDataError);
    component = fixture.componentInstance;
    component.candidateDataUnavailable = false;
    component.candidateDataError = false;
    component.isOfflineError = false;
    component.niLicenceDetected = false;
  }));

  describe('Class', () => {
    describe('get errorHeading', () => {
      it('should return the appropriate message for when candidate is from NI', () => {
        component.niLicenceDetected = true;
        expect(component.errorHeading).toEqual('Northern Irish Licence detected');
      });
      it('should return the appropriate message for when details unavailable', () => {
        component.candidateDataUnavailable = true;
        expect(component.errorHeading).toEqual('Error obtaining details');
      });
      it('should return the appropriate message for when details not found', () => {
        component.candidateDataError = true;
        expect(component.errorHeading).toEqual('No data found');
      });
      it('should return the appropriate message for when user is offline', () => {
        component.isOfflineError = true;
        expect(component.errorHeading).toEqual('No connectivity');
      });
      it('should display a default message if no other conditions met', () => {
        expect(component.errorHeading).toEqual('Unknown error');
      });
    });
    describe('get errorBody', () => {
      it('should return the appropriate message for when candidate is from NI', () => {
        component.niLicenceDetected = true;
        expect(component.errorBody).toEqual('No details will be held by DVLA for candidate.');
      });
      it('should return the appropriate message for when details unavailable', () => {
        component.candidateDataUnavailable = true;
        expect(component.errorBody).toEqual('We are unable to return DVLA data for given candidate.');
      });
      it('should return the appropriate message for when details not found', () => {
        component.candidateDataError = true;
        expect(component.errorBody).toEqual('No DVLA data has been found using candidates driving licence number.');
      });
      it('should return the appropriate message for when user is offline', () => {
        component.isOfflineError = true;
        expect(component.errorBody).toEqual('DVLA licence information currently unavailable.');
      });
      it('should display a default message if no other conditions met', () => {
        expect(component.errorBody).toEqual('We have received an unknown error for this candidate.');
      });
    });
  });
});

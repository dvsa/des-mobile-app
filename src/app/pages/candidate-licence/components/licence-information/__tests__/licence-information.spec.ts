import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { IonicModule } from '@ionic/angular';
import { DriverLicenceSchema } from '@dvsa/mes-driver-schema';
import { DomSanitizer } from '@angular/platform-browser';
import { DomSanitizerMock } from '@mocks/angular-mocks/dom-sanitizer.mock';
import { SIGNATURE_MOCK } from '@pages/candidate-licence/candidate-licence.mock';
import { LicenceInformation } from '../licence-information';

describe('LicenceInformation', () => {
  let fixture: ComponentFixture<LicenceInformation>;
  let component: LicenceInformation;
  let domSanitizer: DomSanitizer;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [LicenceInformation],
      imports: [IonicModule],
      providers: [{ provide: DomSanitizer, useClass: DomSanitizerMock }],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(LicenceInformation);
    component = fixture.componentInstance;
    domSanitizer = TestBed.inject(DomSanitizer);

    component.bookingAge = 20;
    component.bookingDriverNumber = 'ABC12321DEF12';
    component.bookingGender = 'Female';
    component.bookingName = 'Some Candidate';
    component.candidateData = {
      driverStandard: {
        driver: {
          dateOfBirth: '1997-01-30',
          drivingLicenceNumber: 'GDJS123LXL3',
          firstNames: 'Given names',
          gender: 'Male',
          lastName: 'Lastname',
        },
        token: {
          validToDate: '2022-12-31',
        },
      },
      driverSignature: { signature: { image: 'sig', imageFormat: 'format' } },
    } as DriverLicenceSchema;
  }));

  afterAll(() => {
    jasmine.clock()?.uninstall();
  });

  describe('Class', () => {
    describe('get driverNumber', () => {
      it('should return the value of `this.bookingDriverNumber`', () => {
        component.isPracticeMode = true;
        expect(component.driverNumber).toEqual('ABC12321DEF12');
      });
      it('should return the drivingLicenceNumber from the candidateData', () => {
        component.isPracticeMode = false;
        expect(component.driverNumber).toEqual('GDJS123LXL3');
      });
    });
    describe('get name', () => {
      it('should return the value of `this.bookingName`', () => {
        component.isPracticeMode = true;
        expect(component.name).toEqual('Some Candidate');
      });
      it('should return empty when `this.candidateData` is not defined', () => {
        component.isPracticeMode = false;
        component.candidateData = null;
        expect(component.name).toEqual('');
      });
      it('should return a full name from the candidateData', () => {
        component.isPracticeMode = false;
        expect(component.name).toEqual('Given names Lastname');
      });
    });
    describe('get age', () => {
      it('should return the value of `this.bookingAge`', () => {
        component.isPracticeMode = true;
        expect(component.age).toEqual(20);
      });
      it('should use the dateOfBirth from the candidateData to determine the age', () => {
        component.isPracticeMode = false;
        expect(component.age).toEqual(25);
      });
    });
    describe('get gender', () => {
      it('should return the value of `this.bookingGender`', () => {
        component.isPracticeMode = true;
        expect(component.gender).toEqual('Female');
      });
      it('should return the gender from the candidateData', () => {
        component.isPracticeMode = false;
        expect(component.gender).toEqual('Male');
      });
    });
    describe('get cardExpiryDate', () => {
      it('should return a date 5 years from date in UK format', () => {
        jasmine.clock().mockDate(new Date('2022-10-24'));
        component.isPracticeMode = true;
        expect(component.cardExpiryDate).toEqual('24/10/2027');
      });
      it('should return the card validToDate from the candidateData in UK format', () => {
        component.isPracticeMode = false;
        expect(component.cardExpiryDate).toEqual('31/12/2022');
      });
    });
    describe('get signature', () => {
      beforeEach(() => {
        spyOn(domSanitizer, 'bypassSecurityTrustUrl').and.returnValue('stub url');
      });
      it('should use the mock signature in practice mode', () => {
        component.isPracticeMode = true;
        expect(component.signature).not.toBeNull();
        expect(domSanitizer.bypassSecurityTrustUrl).toHaveBeenCalledWith(
          `data:${SIGNATURE_MOCK.imageFormat};base64,${SIGNATURE_MOCK.image}`,
        );
      });
      it('should return empty when not in practice mode but no data', () => {
        component.isPracticeMode = false;
        component.candidateData = null;
        expect(component.signature).toEqual('');
        expect(domSanitizer.bypassSecurityTrustUrl).not.toHaveBeenCalled();
      });
      it('should use the candidateData and call dom method', () => {
        component.isPracticeMode = false;
        expect(component.signature).not.toBeNull();
        expect(domSanitizer.bypassSecurityTrustUrl).toHaveBeenCalledWith('data:format;base64,sig');
      });
    });
  });
});

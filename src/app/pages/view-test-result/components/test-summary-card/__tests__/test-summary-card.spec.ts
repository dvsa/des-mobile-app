import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { DataRowComponent } from '@components/common/data-row/data-row';
import { DataRowCustomComponent } from '@components/common/data-row-custom/data-row-custom';
import { IndependentDriving, WeatherConditions } from '@dvsa/mes-test-schema/categories/common';
import { configureTestSuite } from 'ng-bullet';
import { ModeOfTransport } from '@dvsa/mes-test-schema/categories/AM2';
import { TestSummaryCardComponent } from '../test-summary-card';

describe('TestSummaryCardComponent', () => {
  let fixture: ComponentFixture<TestSummaryCardComponent>;
  let component: TestSummaryCardComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestSummaryCardComponent,
        MockComponent(DataRowComponent),
        MockComponent(DataRowCustomComponent),
      ],
      imports: [
        IonicModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(TestSummaryCardComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('getAccompaniedBy', () => {
      it('should return the correct data', () => {
        const accompaniment = {
          ADI: true,
          interpreter: true,
          other: true,
          supervisor: true,
        };
        component.accompaniment = accompaniment;
        fixture.detectChanges();
        expect(component.getAccompaniedBy()).toEqual('ADI, Interpreter, Supervisor and Other');
      });

      it('should return None when there is no accompaniment ', () => {
        expect(component.getAccompaniedBy()).toEqual('None');
      });
    });

    describe('getProvisionalLicenceProvided', () => {
      it('should return yes if the licence has been provided', () => {
        const passCompletion = {
          provisionalLicenceProvided: true,
          passCertificateNumber: 'A123456X',
        };
        component.passCompletion = passCompletion;
        fixture.detectChanges();
        expect(component.getProvisionalLicenceProvided()).toEqual('Yes');
      });

      it('should return no if the licence has not been provided', () => {
        const passCompletion = {
          provisionalLicenceProvided: false,
          passCertificateNumber: 'A123456X',
        };
        component.passCompletion = passCompletion;
        fixture.detectChanges();
        expect(component.getProvisionalLicenceProvided()).toEqual('No');
      });

      it('should return no if there is no passCompletion', () => {
        expect(component.getProvisionalLicenceProvided()).toEqual('No');
      });
    });

    describe('getCode78', () => {
      it('should return null if the data does not exist', () => {
        const passCompletion = {
          provisionalLicenceProvided: false,
          passCertificateNumber: 'A123456X',
        };
        component.passCompletion = passCompletion;
        fixture.detectChanges();
        expect(component.getCode78()).toEqual(null);
      });
      it('should return yes if code78 is true', () => {
        const passCompletion = {
          provisionalLicenceProvided: false,
          passCertificateNumber: 'A123456X',
          code78Present: true,
        };
        component.passCompletion = passCompletion;
        fixture.detectChanges();
        expect(component.getCode78()).toEqual('Yes');
      });
      it('should return no if code78 is false', () => {
        const passCompletion = {
          provisionalLicenceProvided: false,
          passCertificateNumber: 'A123456X',
          code78Present: false,
        };
        component.passCompletion = passCompletion;
        fixture.detectChanges();
        expect(component.getCode78()).toEqual('No');
      });
    });

    describe('getPassCertificateNumber', (() => {
      it('should return the correct data', () => {
        const passCompletion = {
          passCertificateNumber: 'A123456X',
          provisionalLicenceProvided: false,
        };
        component.passCompletion = passCompletion;
        fixture.detectChanges();
        expect(component.getPassCertificateNumber()).toEqual('A123456X');
      });

      it('should return undefined if the passCompletion is missing', () => {
        expect(component.getPassCertificateNumber()).toEqual(undefined);
      });
    }));

    describe('getRouteNumber', () => {
      it('should return the correct data', () => {
        const testSummary = {
          routeNumber: 57,
        };
        component.testSummary = testSummary;
        fixture.detectChanges();
        expect(component.getRouteNumber()).toEqual(57);
      });

      it('should return None if the testSummary is missing', () => {
        expect(component.getRouteNumber()).toEqual('None');
      });
    });

    describe('getIndependentDriving', () => {
      it('should return the correct data', () => {
        const testSummary = {
          independentDriving: 'Diagram' as IndependentDriving,
        };
        component.testSummary = testSummary;
        fixture.detectChanges();
        expect(component.getIndependentDriving()).toEqual('Diagram');
      });

      it('should return None if the testSummary is missing', () => {
        expect(component.getIndependentDriving()).toEqual('None');
      });
    });

    describe('getCandidateDescription', () => {
      it('should return the correct data', () => {
        const testSummary = {
          candidateDescription: 'Test Description',
        };
        component.testSummary = testSummary;
        fixture.detectChanges();
        expect(component.getCandidateDescription()).toEqual('Test Description');
      });

      it('should return None if the testSummary is missing', () => {
        expect(component.getCandidateDescription()).toEqual('None');
      });
    });

    describe('getDebriefWitnessed', () => {
      it('should return yes if the debrief was witnessed ', () => {
        const testSummary = {
          debriefWitnessed: true,
        };
        component.testSummary = testSummary;
        fixture.detectChanges();
        expect(component.getDebriefWitnessed()).toEqual('Yes');
      });

      it('should return no if the debrief was not witnessed ', () => {
        const testSummary = {
          debriefWitnessed: false,
        };
        component.testSummary = testSummary;
        fixture.detectChanges();
        expect(component.getDebriefWitnessed()).toEqual('No');
      });

      it('should return no if the testSummary is missing', () => {
        expect(component.getDebriefWitnessed()).toEqual('No');
      });
    });

    describe('getWeatherConditions', () => {
      it('should return the correct data', () => {
        const testSummary = {
          weatherConditions: [
            'Icy',
            'Showers',
            'Windy',
          ] as WeatherConditions[],
        };
        component.testSummary = testSummary;
        fixture.detectChanges();
        expect(component.getWeatherConditions()).toEqual('Icy, Showers and Windy');
      });

      it('should return None if the testSummary is missing', () => {
        expect(component.getWeatherConditions()).toEqual('None');
      });
    });

    describe('getD255', () => {
      it('should return yes if a D255 was needed ', () => {
        const testSummary = {
          D255: true,
        };
        component.testSummary = testSummary;
        fixture.detectChanges();
        expect(component.getD255()).toEqual('Yes');
      });

      it('should return no if a D255 was not needed ', () => {
        const testSummary = {
          D255: false,
        };
        component.testSummary = testSummary;
        fixture.detectChanges();
        expect(component.getDebriefWitnessed()).toEqual('No');
      });

      it('should return no if the testSummary is missing', () => {
        expect(component.getDebriefWitnessed()).toEqual('No');
      });
    });

    describe('getAdditionalInformation', () => {
      it('should return the correct data', () => {
        const testSummary = {
          additionalInformation: 'Test Additional Information',
        };
        component.testSummary = testSummary;
        fixture.detectChanges();
        expect(component.getAdditionalInformation()).toEqual('Test Additional Information');
      });

      it('should return None if the testSummary is missing', () => {
        expect(component.getAdditionalInformation()).toEqual('None');
      });
    });

    describe('shouldDisplayTestConductedOn', () => {
      it('should return true if mode of transport', () => {
        const mode: ModeOfTransport = 'Bike to bike';
        component.testSummary = {
          modeOfTransport: mode,
        };
        expect(component.shouldDisplayTestConductedOn()).toEqual(true);
      });
      it('should return false if no mode of transport', () => {
        component.testSummary = {
          additionalInformation: 'Test Additional Information',
        };
        expect(component.shouldDisplayTestConductedOn()).toEqual(false);
      });
    });

    describe('getTestConductedOn', () => {
      it('should return the mode of transport if populated', () => {
        const mode: ModeOfTransport = 'Bike to bike';
        component.testSummary = {
          modeOfTransport: mode,
        };
        expect(component.getTestConductedOn()).toEqual(mode);
      });
      it('should return None if not populated', () => {
        component.testSummary = {
          additionalInformation: 'Test Additional Information',
        };
        expect(component.getTestConductedOn()).toEqual('None');
      });
    });

    describe('getConductedLanguage', () => {
      it('should return the correct data', () => {
        component.communicationPreferences = {
          conductedLanguage: 'English',
          updatedEmail: 'value',
          communicationMethod: 'Email',
        };
        fixture.detectChanges();
        expect(component.getConductedLanguage()).toEqual('English');
      });

      it('should return None if the communicationPreferences is missing', () => {
        expect(component.getAdditionalInformation()).toEqual('None');
      });
    });

  });
});

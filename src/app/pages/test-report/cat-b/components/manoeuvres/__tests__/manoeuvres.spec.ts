import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppModule } from '@app/app.module';
import { DangerousFaultBadgeComponent } from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { IonicModule } from '@ionic/angular';
import { StoreModule } from '@ngrx/store';
import { testReportReducer } from '@pages/test-report/test-report.reducer';
import { configureTestSuite } from 'ng-bullet';
import { MockComponent } from 'ng-mocks';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { ManoeuvresComponent } from '../manoeuvres';

describe('ManoeuvresComponent', () => {
  let fixture: ComponentFixture<ManoeuvresComponent>;
  let component: ManoeuvresComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ManoeuvresComponent,
        TickIndicatorComponent,
        MockComponent(DrivingFaultsBadgeComponent),
        MockComponent(SeriousFaultBadgeComponent),
        MockComponent(DangerousFaultBadgeComponent),
      ],
      imports: [
        IonicModule,
        AppModule,
        StoreModule.forRoot({
          tests: () => ({
            currentTest: {
              slotId: '123',
            },
            testStatus: {},
            startedTests: {
              123: {
                testData: {
                  dangerousFaults: {},
                  drivingFaults: {},
                  manoeuvres: {},
                  seriousFaults: {},
                  testRequirements: {},
                  ETA: {},
                  eco: {},
                  vehicleChecks: {
                    showMeQuestion: {
                      code: 'S3',
                      description: '',
                      outcome: '',
                    },
                    tellMeQuestion: {
                      code: '',
                      description: '',
                      outcome: '',
                    },
                  },
                  eyesightTest: {},
                },
                postTestDeclarations: {
                  healthDeclarationAccepted: false,
                  passCertificateNumberReceived: false,
                  postTestSignature: '',
                },
                journalData: {},
                communicationPreferences: {
                  updatedEmail: '',
                  communicationMethod: 'Not provided',
                  conductedLanguage: 'Not provided',
                },
              },
            },
          }),
          testReport: testReportReducer,
        }),
      ],
      providers: [
        { provide: DateTimeProvider, useCalss: DateTimeProviderMock },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ManoeuvresComponent);
    component = fixture.componentInstance;
  }));

  describe('DOM', () => {
    describe('Button', () => {
      it('should show provided label', () => {
        component.controlLabel = 'a label';
        fixture.detectChanges();
        const label = fixture.debugElement.query(By.css('.label'));
        expect(label.nativeElement.innerHTML).toBe('a label');
      });
    });
    describe('Button', () => {
      it('should display popover type control content when displayPopover is true', () => {
        component.displayPopover = true;
        fixture.detectChanges();
        const tickDe = fixture.debugElement.query(By.css('.popover'));
        expect(tickDe).toBeDefined();
      });
    });
  });
});

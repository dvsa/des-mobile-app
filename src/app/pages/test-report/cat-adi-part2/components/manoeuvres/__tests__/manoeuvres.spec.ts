import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { AppModule } from '@app/app.module';
import { MockComponent } from 'ng-mocks';
import {
  DrivingFaultsBadgeComponent,
} from '@components/common/driving-faults-badge/driving-faults-badge';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import {
  SeriousFaultBadgeComponent,
} from '@components/common/serious-fault-badge/serious-fault-badge';
import {
  DangerousFaultBadgeComponent,
} from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { StoreModule } from '@ngrx/store';
import { NavigationStateProvider } from '@providers/navigation-state/navigation-state';
import {
  NavigationStateProviderMock,
} from '@providers/navigation-state/__mocks__/navigation-state.mock';
import { testReportReducer } from '../../../../test-report.reducer';
import { ManoeuvresComponent } from '../manoeuvres';

describe('ManoeuvresComponent', () => {
  let fixture: ComponentFixture<ManoeuvresComponent>;
  let component: ManoeuvresComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ManoeuvresComponent,
        MockComponent(TickIndicatorComponent),
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
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: NavigationStateProvider, useClass: NavigationStateProviderMock },
      ],
    });

    fixture = TestBed.createComponent(ManoeuvresComponent);
    component = fixture.componentInstance;
  }));

  describe('DOM', () => {
    describe('Button', () => {
      it('should show provided label', () => {
        component.controlLabel = 'a label';
        fixture.detectChanges();
        const label = fixture.debugElement.query(By.css('#label'));
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
    describe('togglePopoverDisplay', () => {
      it('should invert displayPopover and call toggleOverlay', () => {
        spyOn(component, 'toggleOverlay');
        component.displayPopover = true;
        component.togglePopoverDisplay();
        expect(component.displayPopover).toEqual(false);
        expect(component.toggleOverlay).toHaveBeenCalled();
      });
    });
    describe('toggleOverlay', () => {
      it('should call callbackMethod if clickCallback is present', () => {
        component.clickCallback = {
          callbackMethod: () => {},
        };
        spyOn(component.clickCallback, 'callbackMethod');
        component.toggleOverlay();
        expect(component.clickCallback.callbackMethod).toHaveBeenCalled();
      });
    });
  });
});

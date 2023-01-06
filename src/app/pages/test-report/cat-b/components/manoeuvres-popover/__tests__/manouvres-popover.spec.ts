import { ManoeuvresPopoverComponent } from '@pages/test-report/cat-b/components/manoeuvres-popover/manoeuvres-popover';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { ManoeuvreCompetencies, ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { MockComponent } from 'ng-mocks';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { ManoeuvreCompetencyComponent } from '@pages/test-report/components/manoeuvre-competency/manoeuvre-competency';
import { IonicModule, NavController } from '@ionic/angular';
import { AppModule } from '@app/app.module';
import { testReportReducer } from '@pages/test-report/test-report.reducer';
import { NavControllerMock } from '@mocks/index.mock';
import { NavigationStateProviderMock } from '@providers/navigation-state/__mocks__/navigation-state.mock';
import { NavigationStateProvider } from '@providers/navigation-state/navigation-state';
import { RecordManoeuvresSelection } from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';

describe('ManoeuvresPopoverComponent', () => {
  let fixture: ComponentFixture<ManoeuvresPopoverComponent>;
  let component: ManoeuvresPopoverComponent;
  let store$: Store<StoreModel>;

  const mockTestData = {
    dangerousFaults: {},
    drivingFaults: {},
    manoeuvres: [{ reverseRight: { selected: true } }, {}],
    seriousFaults: {},
    testRequirements: {},
    ETA: {},
    eco: {},
    vehicleChecks: {
      showMeQuestion: [],
      tellMeQuestion: [
        {
          code: 'T4',
          description: '',
          outcome: 'DF',
        },
      ],
    },
    eyesightTest: {},
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ManoeuvresPopoverComponent,
        MockComponent(DrivingFaultsBadgeComponent),
        MockComponent(ManoeuvreCompetencyComponent),
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
                testData: mockTestData,
                postTestDeclarations: {
                  healthDeclarationAccepted: false,
                  passCertificateNumberReceived: false,
                  postTestSignature: '',
                },
                journalData: {},
                category: 'ADI2',
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
        { provide: NavController, useClass: NavControllerMock },
        { provide: NavigationStateProvider, useClass: NavigationStateProviderMock },
      ],
    });

    fixture = TestBed.createComponent(ManoeuvresPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch').and.callThrough();
  }));

  describe('manoeuvreHasFaults', () => {
    it('should return true is manoeuvre is present and controlFault is not null', () => {
      expect(component.manoeuvreHasFaults({ controlFault: 'present' })).toBeTruthy();
    });
    it('should return true is manoeuvre is present and observationFault is not null', () => {
      expect(component.manoeuvreHasFaults({ observationFault: 'present' })).toBeTruthy();
    });
    it('should return null is manoeuvre is not present', () => {
      expect(component.manoeuvreHasFaults(null)).toBeNull();
    });
  });

  describe('record manoeuvre', () => {
    it('should dispatch a RECORD_MANOEUVRES_SELECTION action', () => {
      component.recordManoeuvreSelection(ManoeuvreTypes.reverseParkRoad);
      expect(store$.dispatch).toHaveBeenCalledWith(RecordManoeuvresSelection(ManoeuvreTypes.reverseParkRoad));
    });
  });

  describe('getId', () => {
    it('should return "forwardPark-controlFault"', () => {
      expect(component.getId(ManoeuvreTypes.forwardPark, ManoeuvreCompetencies.controlFault))
        .toBe('forwardPark-controlFault');
    });
  });
});

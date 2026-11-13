import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { NavController } from '@ionic/angular';
import { NavControllerMock } from '@mocks/index.mock';
import { Store, StoreModule } from '@ngrx/store';
import { NavigationStateProviderMock } from '@providers/navigation-state/__mocks__/navigation-state.mock';
import { NavigationStateProvider } from '@providers/navigation-state/navigation-state';
import { StoreModel } from '@shared/models/store.model';
import {
  AddManoeuvreDangerousFault,
  AddManoeuvreDrivingFault,
  AddManoeuvreSeriousFault,
  RecordManoeuvresSelection,
} from '@store/tests/test-data/cat-adi-part2/manoeuvres/manoeuvres.actions';
import { ManoeuvreCompetencies, ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { testsCatADIPart2Reducer } from '@store/tests/tests.cat-adi-part2.reducer';
import { testsReducer } from '@store/tests/tests.reducer';
import { MockComponent } from 'ng-mocks';
import { initialState as initialTestReportState, testReportReducer } from '../../../../test-report.reducer';
import { ManoeuvreCompetencyComponentAdiPart2 } from '../../manoeuvre-competency/manoeuvre-competency';
import { ManoeuvresPopoverComponentAdiPart2 } from '../manoeuvres-popover';

describe('ManoeuvresPopoverComponentAdiPart2', () => {
  let fixture: ComponentFixture<ManoeuvresPopoverComponentAdiPart2>;
  let component: ManoeuvresPopoverComponentAdiPart2;
  let store$: Store<StoreModel>;

  const mockTestData: CatADI2UniqueTypes.TestData = {
    dangerousFaults: {},
    drivingFaults: {},
    manoeuvres: [{ reverseRight: { selected: true } }, {}],
    seriousFaults: {},
    testRequirements: {},
    ETA: {},
    eco: {},
    vehicleChecks: {
      showMeQuestions: [],
      tellMeQuestions: [
        {
          code: 'T4',
          description: '',
          outcome: 'DF',
        },
      ],
    },
    eyesightTest: {},
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(
          { tests: testsReducer, testReport: testReportReducer },
          {
            initialState: {
              testReport: initialTestReportState,
              tests: {
                currentTest: {
                  slotId: '123',
                },
                testStatus: {},
                startedTests: {
                  123: {
                    ...testsCatADIPart2Reducer({ type: '@@init' }, undefined),
                    testData: mockTestData,
                    postTestDeclarations: {
                      healthDeclarationAccepted: false,
                      passCertificateNumberReceived: false,
                      postTestSignature: '',
                    },
                    category: 'ADI2',
                    communicationPreferences: {
                      updatedEmail: '',
                      communicationMethod: 'Not provided',
                      conductedLanguage: 'Not provided',
                    },
                  },
                },
              },
            },
          }
        ),
        ManoeuvresPopoverComponentAdiPart2,
        MockComponent(DrivingFaultsBadgeComponent),
        MockComponent(ManoeuvreCompetencyComponentAdiPart2),
      ],
      providers: [
        { provide: NavController, useClass: NavControllerMock },
        { provide: NavigationStateProvider, useClass: NavigationStateProviderMock },
      ],
    });

    fixture = TestBed.createComponent(ManoeuvresPopoverComponentAdiPart2);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store$ = TestBed.inject(Store);
    vi.spyOn(store$, 'dispatch');
  });

  describe('Class', () => {
    it('should display the correct competencies against each manoeuvre', () => {
      component.recordManoeuvreSelection(ManoeuvreTypes.reverseParkRoad, 0);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#reverseRight-controlFault1'))).toBeNull();
      expect(fixture.debugElement.query(By.css('#reverseRight-observationFault1'))).toBeNull();
      expect(fixture.debugElement.query(By.css('#reverseParkRoad-controlFault1'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('#reverseParkRoad-observationFault1'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('#reverseParkCarpark-controlFault1'))).toBeNull();
      expect(fixture.debugElement.query(By.css('#reverseParkCarpark-observationFault1'))).toBeNull();
      expect(fixture.debugElement.query(By.css('#forwardPark-controlFault1'))).toBeNull();
      expect(fixture.debugElement.query(By.css('#forwardPark-observationFault1'))).toBeNull();
    });

    describe('record manoeuvre', () => {
      it('should dispatch a RECORD_MANOEUVRES_SELECTION action', () => {
        component.recordManoeuvreSelection(ManoeuvreTypes.reverseParkRoad, 0);
        expect(store$.dispatch).toHaveBeenCalledWith(RecordManoeuvresSelection(ManoeuvreTypes.reverseParkRoad, 0));
      });
    });

    describe('hiding manoeuvres', () => {
      it('should hide a manoeuvre in position 2 when already selected in position 1', () => {
        component.recordManoeuvreSelection(ManoeuvreTypes.reverseParkRoad, 0);
        component.recordManoeuvreSelection(ManoeuvreTypes.reverseParkCarpark, 1);
        component.recordManoeuvreSelection(ManoeuvreTypes.reverseParkCarpark, 0);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#manoeuvres-reverse-right-radio2')).nativeElement.disabled).toBe(
          false
        );
        expect(fixture.debugElement.query(By.css('#manoeuvres-reverse-park-road-radio2')).nativeElement.disabled).toBe(
          false
        );
        expect(
          fixture.debugElement.query(By.css('#manoeuvres-reverse-park-carpark-radio2')).nativeElement.disabled
        ).toBe(true);
        expect(fixture.debugElement.query(By.css('#manoeuvres-forward-park-radio2')).nativeElement.disabled).toBe(
          false
        );
      });
    });

    describe('disabling manoeuvres', () => {
      it('should not disable manoeuvres when a manoeuvre is selected', () => {
        component.recordManoeuvreSelection(ManoeuvreTypes.reverseParkRoad, 0);
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#manoeuvres-reverse-right-radio1')).nativeElement.disabled).toBe(
          false
        );
        expect(fixture.debugElement.query(By.css('#manoeuvres-reverse-park-road-radio1')).nativeElement.disabled).toBe(
          false
        );
        expect(
          fixture.debugElement.query(By.css('#manoeuvres-reverse-park-carpark-radio1')).nativeElement.disabled
        ).toBe(false);
        expect(fixture.debugElement.query(By.css('#manoeuvres-forward-park-radio1')).nativeElement.disabled).toBe(
          false
        );
      });

      it('should disable other manoeuvres from being selected when a driving fault is added', () => {
        store$.dispatch(
          AddManoeuvreDrivingFault(
            {
              manoeuvre: ManoeuvreTypes.reverseRight,
              competency: ManoeuvreCompetencies.controlFault,
            },
            0
          )
        );
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#manoeuvres-reverse-right-radio1')).nativeElement.disabled).toBe(
          false
        );
        expect(fixture.debugElement.query(By.css('#manoeuvres-reverse-park-road-radio1')).nativeElement.disabled).toBe(
          true
        );
        expect(
          fixture.debugElement.query(By.css('#manoeuvres-reverse-park-carpark-radio1')).nativeElement.disabled
        ).toBe(true);
        expect(fixture.debugElement.query(By.css('#manoeuvres-forward-park-radio1')).nativeElement.disabled).toBe(true);
      });

      it('should disable other manoeuvres from being selected when a serious fault is added', () => {
        store$.dispatch(
          AddManoeuvreSeriousFault(
            {
              manoeuvre: ManoeuvreTypes.reverseRight,
              competency: ManoeuvreCompetencies.controlFault,
            },
            0
          )
        );
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#manoeuvres-reverse-right-radio1')).nativeElement.disabled).toBe(
          false
        );
        expect(fixture.debugElement.query(By.css('#manoeuvres-reverse-park-road-radio1')).nativeElement.disabled).toBe(
          true
        );
        expect(
          fixture.debugElement.query(By.css('#manoeuvres-reverse-park-carpark-radio1')).nativeElement.disabled
        ).toBe(true);
        expect(fixture.debugElement.query(By.css('#manoeuvres-forward-park-radio1')).nativeElement.disabled).toBe(true);
      });

      it('should disable other manoeuvres from being selected when a dangerous fault is added', () => {
        store$.dispatch(
          AddManoeuvreDangerousFault(
            {
              manoeuvre: ManoeuvreTypes.reverseRight,
              competency: ManoeuvreCompetencies.controlFault,
            },
            0
          )
        );
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#manoeuvres-reverse-right-radio1')).nativeElement.disabled).toBe(
          false
        );
        expect(fixture.debugElement.query(By.css('#manoeuvres-reverse-park-road-radio1')).nativeElement.disabled).toBe(
          true
        );
        expect(
          fixture.debugElement.query(By.css('#manoeuvres-reverse-park-carpark-radio1')).nativeElement.disabled
        ).toBe(true);
        expect(fixture.debugElement.query(By.css('#manoeuvres-forward-park-radio1')).nativeElement.disabled).toBe(true);
      });
    });
  });

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

  describe('getId', () => {
    it('should return "forwardPark-controlFault1"', () => {
      expect(component.getId(ManoeuvreTypes.forwardPark, ManoeuvreCompetencies.controlFault, 1)).toBe(
        'forwardPark-controlFault1'
      );
    });
  });
});

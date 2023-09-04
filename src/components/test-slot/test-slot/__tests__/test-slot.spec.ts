import { MockComponent } from 'ng-mocks';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { cloneDeep } from 'lodash';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { testsReducer } from '@store/tests/tests.reducer';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { StoreModel } from '@shared/models/store.model';
import { SetTestStatusDecided } from '@store/tests/test-status/test-status.actions';
import { StartTest } from '@store/tests/tests.actions';
import { ActivityCodes } from '@shared/models/activity-codes';
import { SpecialNeedsCode } from '@shared/helpers/get-slot-type';
import { SlotProvider } from '@providers/slot/slot';
import { CategoryWhitelistProvider } from '@providers/category-whitelist/category-whitelist';
import { TestSlotComponent } from '@components/test-slot/test-slot/test-slot';
import { IndicatorsComponent } from '@components/test-slot/indicators/indicators';
import { TimeComponent } from '@components/test-slot/time/time';
import { TestOutcomeComponent } from '@components/test-slot/test-outcome/test-outcome';
import { CandidateLinkComponent } from '@components/test-slot/candidate-link/candidate-link';
import { TestCategoryComponent } from '@components/test-slot/test-category/test-category';
import { VehicleDetailsComponent } from '@components/test-slot/vehicle-details/vehicle-details';
import { LanguageComponent } from '@components/test-slot/language/language';
import { SubmissionStatusComponent } from '@components/test-slot/submission-status/submission-status';
import { ProgressiveAccessComponent } from '@components/test-slot/progressive-access/progressive-access';
import { LocationComponent } from '@components/test-slot/location/location';
import { DateComponent } from '@components/test-slot/date/date';
import {
  AdditionalCandidateDetailsComponent,
} from '@components/test-slot/additional-candidate-details/additional-candidate-details';
import { AppComponent } from '@app/app.component';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';

import { AccessibilityServiceMock } from '@providers/accessibility/__mocks__/accessibility-service.mock';

describe('TestSlotComponent', () => {
  let fixture: ComponentFixture<TestSlotComponent>;
  let component: TestSlotComponent;
  const startTime = '2019-02-01T11:22:33+00:00';
  let store$: Store<StoreModel>;
  const mockSlot: TestSlot = {
    slotDetail: {
      slotId: 1001,
      start: startTime,
      duration: 57,
    },
    vehicleSlotTypeCode: 57,
    testCentre: {
      centreId: 54321,
      centreName: 'Example Test Centre',
      costCode: 'EXTC1',
    },
    booking: {
      candidate: {
        candidateId: 101,
        candidateName: {
          title: 'Miss',
          firstName: 'Florence',
          lastName: 'Pearson',
        },
        driverNumber: 'PEARS015220A99HC',
        gender: 'F',
        candidateAddress: {
          addressLine1: '1 Station Street',
          addressLine2: 'Someplace',
          addressLine3: 'Sometown',
          addressLine4: '',
          addressLine5: '',
          postcode: 'AB12 3CD',
        },
        primaryTelephone: '01234 567890',
        secondaryTelephone: '04321 098765',
        mobileTelephone: '07654 123456',
        prn: 123456,
        previousADITests: 2,
      },
      application: {
        applicationId: 1234567,
        bookingSequence: 3,
        checkDigit: 1,
        welshTest: false,
        extendedTest: false,
        meetingPlace: '',
        progressiveAccess: false,
        specialNeeds: 'Candidate has dyslexia',
        specialNeedsCode: SpecialNeedsCode.NONE,
        entitlementCheck: false,
        vehicleSeats: 5,
        vehicleHeight: 4,
        vehicleWidth: 3,
        vehicleLength: 2,
        testCategory: 'B',
        vehicleGearbox: 'Manual',
      },
      previousCancellation: [
        'Act of nature',
      ],
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestSlotComponent,
        MockComponent(LanguageComponent),
        MockComponent(IndicatorsComponent),
        MockComponent(LocationComponent),
        MockComponent(TimeComponent),
        MockComponent(DateComponent),
        MockComponent(TestCategoryComponent),
        MockComponent(TestOutcomeComponent),
        MockComponent(VehicleDetailsComponent),
        MockComponent(AdditionalCandidateDetailsComponent),
        MockComponent(CandidateLinkComponent),
        MockComponent(SubmissionStatusComponent),
        MockComponent(ProgressiveAccessComponent),
      ],
      imports: [
        IonicModule,
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        {
          provide: AppConfigProvider,
          useClass: AppConfigProviderMock,
        },
        {
          provide: DateTimeProvider,
          useClass: DateTimeProviderMock,
        },
        {
          provide: AppComponent,
          useClass: MockAppComponent,
        },
        {
          provide: SlotProvider,
          useClass: SlotProvider,
        },
        {
          provide: AccessibilityService,
          useClass: AccessibilityServiceMock,
        },
        CategoryWhitelistProvider,
      ],
    });

    fixture = TestBed.createComponent(TestSlotComponent);
    component = fixture.componentInstance;
    component.slot = cloneDeep(mockSlot);
    component.showLocation = true;
    store$ = TestBed.inject(Store);
  }));

  afterAll(() => {
    if (jasmine.clock) {
      jasmine.clock()
        .uninstall();
    }
  });

  describe('Class', () => {
    describe('isIndicatorNeededForSlot', () => {
      it('should return true if specialNeeds is a non-blank string', () => {
        expect(component.isIndicatorNeededForSlot())
          .toBe(true);
      });
      it('should return false if specialNeeds is blank (entitlementCheck is false, slotType is Standard)', () => {
        component.slot.booking.application.specialNeeds = '';
        component.slot.booking.application.entitlementCheck = false;
        component.slot.booking.application.specialNeedsCode = SpecialNeedsCode.NONE;
        expect(component.isIndicatorNeededForSlot())
          .toBe(false);
      });
      it('should return false if specialNeeds is missing', () => {
        delete component.slot.booking.application;
        expect(component.isSpecialNeedsSlot())
          .toBe(false);
      });
      it('should return true if entitlementCheck is true (specialNeeds is blank, slotType is Standard)', () => {
        component.slot.booking.application.specialNeeds = '';
        component.slot.booking.application.entitlementCheck = true;
        component.slot.booking.application.specialNeedsCode = SpecialNeedsCode.NONE;
        expect(component.isIndicatorNeededForSlot())
          .toBe(true);
      });
      it('should return false if entitlementCheck is missing (specialNeeds is blank, slotType is Standard)', () => {
        component.slot.booking.application.specialNeeds = '';
        delete component.slot.booking.application.entitlementCheck;
        component.slot.booking.application.specialNeedsCode = SpecialNeedsCode.NONE;
        expect(component.isIndicatorNeededForSlot())
          .toBe(false);
      });
      it('should return false if entitlementCheck is false (specialNeeds is blank, slotType is Standard)', () => {
        component.slot.booking.application.specialNeeds = '';
        component.slot.booking.application.entitlementCheck = false;
        component.slot.booking.application.specialNeedsCode = SpecialNeedsCode.NONE;
        expect(component.isIndicatorNeededForSlot())
          .toBe(false);
      });
      it('should return true if slotType is not Standard (specialNeeds is blank, entitlementCheck is false)', () => {
        component.slot.booking.application.specialNeeds = '';
        component.slot.booking.application.entitlementCheck = false;
        component.slot.booking.application.specialNeedsCode = SpecialNeedsCode.EXTRA;
        expect(component.isIndicatorNeededForSlot())
          .toBe(true);
      });
      it('should return false if slotType is Standard (specialNeeds is blank, entitlementCheck is false )', () => {
        component.slot.booking.application.specialNeeds = '';
        component.slot.booking.application.entitlementCheck = false;
        component.slot.booking.application.specialNeedsCode = SpecialNeedsCode.NONE;
        expect(component.isIndicatorNeededForSlot())
          .toBe(false);
      });

      it('should return correct value for showing vehicle details', () => {
        component.slot.booking.application.testCategory = 'ADI2';
        expect(component.showVehicleDetails())
          .toEqual(false);
        component.slot.booking.application.testCategory = 'A';
        expect(component.showVehicleDetails())
          .toEqual(false);
        component.slot.booking.application.testCategory = 'A1';
        expect(component.showVehicleDetails())
          .toEqual(false);
        component.slot.booking.application.testCategory = 'A2';
        expect(component.showVehicleDetails())
          .toEqual(false);
        component.slot.booking.application.testCategory = 'AM';
        expect(component.showVehicleDetails())
          .toEqual(false);
        component.slot.booking.application.testCategory = 'B';
        expect(component.showVehicleDetails())
          .toEqual(false);
        component.slot.booking.application.testCategory = 'B1';
        expect(component.showVehicleDetails())
          .toEqual(false);
        component.slot.booking.application.testCategory = 'B+E';
        expect(component.showVehicleDetails())
          .toEqual(true);
        component.slot.booking.application.testCategory = 'C';
        expect(component.showVehicleDetails())
          .toEqual(true);
        component.slot.booking.application.testCategory = 'C1';
        expect(component.showVehicleDetails())
          .toEqual(true);
        component.slot.booking.application.testCategory = 'C1+E';
        expect(component.showVehicleDetails())
          .toEqual(true);
        component.slot.booking.application.testCategory = 'C+E';
        expect(component.showVehicleDetails())
          .toEqual(true);
        component.slot.booking.application.testCategory = 'D';
        expect(component.showVehicleDetails())
          .toEqual(true);
        component.slot.booking.application.testCategory = 'D1';
        expect(component.showVehicleDetails())
          .toEqual(true);
        component.slot.booking.application.testCategory = 'D+E';
        expect(component.showVehicleDetails())
          .toEqual(true);
        component.slot.booking.application.testCategory = 'D1+E';
        expect(component.showVehicleDetails())
          .toEqual(true);
      });
    });

    describe('isSpecialNeedsSlot', () => {
      it('should return true if there is a non-empty special needs string', () => {
        component.slot.booking.application.specialNeeds = 'something';
        expect(component.isSpecialNeedsSlot())
          .toBe(true);
      });
      it('should return false if special needs is an empty string', () => {
        component.slot.booking.application.specialNeeds = '';
        expect(component.isSpecialNeedsSlot())
          .toBe(false);
      });
      it('should return false if special needs is null', () => {
        component.slot.booking.application.specialNeeds = null;
        expect(component.isSpecialNeedsSlot())
          .toBe(false);
      });
    });

    describe('isCompletedTest', () => {
      it('should show banner if test status is completed', () => {
        expect(component.isCompletedTest(TestStatus.Completed))
          .toEqual(true);
      });
      it('should not show banner if test status is booked', () => {
        expect(component.isCompletedTest(TestStatus.Booked))
          .toEqual(false);
      });
      it('should not show banner if test status is decided', () => {
        expect(component.isCompletedTest(TestStatus.Decided))
          .toEqual(false);
      });
      it('should not show banner if test status is started', () => {
        expect(component.isCompletedTest(TestStatus.Started))
          .toEqual(false);
      });
      it('should not show banner if test status is submitted', () => {
        expect(component.isCompletedTest(TestStatus.Submitted))
          .toEqual(false);
      });
    });

    describe('DOM', () => {
      describe('Component Interaction', () => {
        it('should pass the special needs status to a indicator component', () => {

          component.slot.booking.application.specialNeeds = '';
          fixture.detectChanges();
          const indicatorComponent = fixture.debugElement.query(
            By.directive(MockComponent(IndicatorsComponent)),
          ).componentInstance;
          expect(indicatorComponent)
            .toBeDefined();
          expect(indicatorComponent.showExclamationIndicator)
            .toEqual(false);
        });

        it('should pass something to sub-component time input', () => {
          fixture.detectChanges();
          const subByDirective = fixture.debugElement.query(By.directive(MockComponent(TimeComponent)))
            .componentInstance;
          expect(subByDirective.time)
            .toBe(startTime);
        });

        it('should pass something to sub-component candidate input', () => {
          fixture.detectChanges();
          const subByDirective = fixture.debugElement.query(
            By.directive(MockComponent(CandidateLinkComponent)),
          ).componentInstance;
          expect(subByDirective.name.title)
            .toBe('Miss');
          expect(subByDirective.name.firstName)
            .toBe('Florence');
          expect(subByDirective.name.lastName)
            .toBe('Pearson');
        });

        it('should pass something to sub-component test-category input', () => {
          fixture.detectChanges();
          const subByDirective = fixture.debugElement.query(
            By.directive(MockComponent(TestCategoryComponent)),
          ).componentInstance;
          expect(subByDirective.category)
            .toBe('B');
        });

        it('should pass something to sub-component test-outcome input', () => {
          fixture.detectChanges();
          component.componentState = {
            testStatus$: of(TestStatus.Booked),
            testActivityCode$: of(ActivityCodes.PASS),
            testPassCertificate$: of('C123456X'),
            isRekey$: of(false),
          };
          fixture.detectChanges();
          const subByDirective = fixture.debugElement.query(
            By.directive(MockComponent(TestOutcomeComponent)),
          ).componentInstance;

          expect(subByDirective.slotDetail.slotId)
            .toEqual(mockSlot.slotDetail.slotId);
          expect(subByDirective.canStartTest)
            .toEqual(true);
        });

        it('should pass test status decided to the test-outcome component when the outcome observable changes', () => {
          fixture.detectChanges();
          store$.dispatch(
            StartTest(mockSlot.slotDetail.slotId, mockSlot.booking.application.testCategory as TestCategory),
          );
          store$.dispatch(SetTestStatusDecided(mockSlot.slotDetail.slotId.toString()));
          fixture.detectChanges();

          const testOutcomeSubComponent = fixture.debugElement.query(
            By.directive(MockComponent(TestOutcomeComponent)),
          ).componentInstance;

          expect(testOutcomeSubComponent.testStatus)
            .toBe(TestStatus.Decided);
        });

        it('should pass something to sub-component vehicle-details input', () => {
          spyOn(component, 'showVehicleDetails')
            .and
            .returnValue(true);
          fixture.detectChanges();

          const subByDirective = fixture.debugElement.query(
            By.directive(MockComponent(VehicleDetailsComponent)),
          ).componentInstance;

          expect(subByDirective.height)
            .toBe(4);
          expect(subByDirective.width)
            .toBe(3);
          expect(subByDirective.length)
            .toBe(2);
          expect(subByDirective.seats)
            .toBe(5);
          expect(subByDirective.transmission)
            .toBe('Manual');
          expect(subByDirective.showVehicleDetails)
            .toBeFalsy();
        });

        it('should pass something to sub-component language input', () => {
          spyOn(component, 'showTopRow').and.returnValue(true);
          fixture.detectChanges();
          const subByDirective = fixture.debugElement.query(
            By.directive(MockComponent(LanguageComponent)),
          ).componentInstance;
          expect(subByDirective.welshLanguage)
            .toEqual(false);
        });

        it('should pass something to sub-component location input', () => {
          fixture.detectChanges();
          const subByDirective = fixture.debugElement.query(
            By.directive(MockComponent(LocationComponent)),
          ).componentInstance;
          expect(subByDirective.location)
            .toBe('Example Test Centre');
        });
      });
    });

  });
});

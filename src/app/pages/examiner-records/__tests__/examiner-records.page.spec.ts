import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IonicModule } from '@ionic/angular';
import { ExaminerRecordsPage } from '../examiner-records.page';
import {
  AccordionChanged,
  ColourFilterChanged,
  DateRangeChanged,
  ExaminerRecordsViewDidEnter,
  HideChartsChanged,
  LocationChanged,
  TestCategoryChanged,
} from '@pages/examiner-records/examiner-records.actions';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { of } from 'rxjs';
import { ColourEnum, ExaminerRecordsProvider, SelectableDateRange } from '@providers/examiner-records/examiner-records';
import { CompressionProvider } from '@providers/compression/compression';
import { SearchProvider } from '@providers/search/search';
import { SearchProviderMock } from '@providers/search/__mocks__/search.mock';
import { ExaminerRecordsProviderMock } from '@providers/examiner-records/__mocks__/examiner-records.mock';

fdescribe('ExaminerStatsPage', () => {
  let component: ExaminerRecordsPage;
  let fixture: ComponentFixture<ExaminerRecordsPage>;
  let store$: MockStore;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExaminerRecordsPage],
      imports: [IonicModule],
      providers: [
        { provide: ExaminerRecordsProvider, useClass: ExaminerRecordsProviderMock },
        CompressionProvider,
        { provide: SearchProvider, useClass: SearchProviderMock },
        { provide: Store, useClass: MockStore },
        provideMockStore({
          initialState: {
            examinerRecords: {
              colourScheme: ColourEnum.Default,
              cachedRecords: null,
              isLoading: false,
              lastUpdatedTime: null,
            },
            tests: {
              startedTests: {
                1: {
                  'appVersion': '4.10.0.0',
                  'version': '3.42.5',
                  'category': 'B',
                  'activityCode': '11',
                  'journalData': {
                    'examiner': { 'staffNumber': '1234567', 'individualId': 9000001 },
                    'testCentre': { 'centreId': 54322, 'costCode': 'EXTC1', 'centreName': 'Example Test Centre' },
                    'testSlotAttributes': {
                      'welshTest': false,
                      'slotId': 5137,
                      'start': new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toString(),
                      'specialNeeds': false,
                      'specialNeedsCode': 'EXTRA',
                      'specialNeedsArray': ['None'],
                      'vehicleTypeCode': 'C',
                      'extendedTest': false,
                      'examinerVisiting': false,
                      'previousCancellation': ['Act of nature'],
                      'entitlementCheck': false,
                      'categoryEntitlementCheck': false,
                      'fitMarker': false,
                      'slotType': 'Extra Time Needed',
                    },
                    'candidate': {
                      'candidateAddress': {
                        'addressLine1': '2345 Station Street',
                        'addressLine2': 'Someplace',
                        'addressLine3': 'Sometown',
                        'postcode': 'AB12 3CD',
                      },
                      'candidateId': 126,
                      'candidateName': { 'firstName': 'test', 'lastName': 'data', 'title': 'Mr' },
                      'driverNumber': 'COOPE015220A99HC',
                      'mobileTelephone': '07654 123456',
                      'primaryTelephone': '01234 567890',
                      'secondaryTelephone': '04321 098765',
                      'dateOfBirth': '1974-09-14',
                      'ethnicityCode': 'E',
                      'gender': 'F',
                    },
                    'applicationReference': { 'applicationId': 20654332, 'bookingSequence': 3, 'checkDigit': 1 },
                  },
                  'preTestDeclarations': {
                    'insuranceDeclarationAccepted': true,
                    'residencyDeclarationAccepted': true,
                    'preTestSignature': '',
                    'candidateDeclarationSigned': false,
                  },
                  'accompaniment': {},
                  'vehicleDetails': {
                    'registrationNumber': '1',
                    'gearboxCategory': 'Manual',
                    'motStatus': 'No details found',
                  },
                  'instructorDetails': {},
                  'testData': {
                    'drivingFaults': { 'moveOffSafety': 1, 'moveOffControl': 1 },
                    'dangerousFaults': {},
                    'seriousFaults': {},
                    'vehicleChecks': {
                      'tellMeQuestion': { 'code': 'T6', 'description': 'Antilock braking system', 'outcome': 'P' },
                      'showMeQuestion': { 'outcome': 'P', 'code': 'S1', 'description': 'Rear windscreen' },
                    },
                    'controlledStop': { 'selected': false },
                    'eco': { 'completed': true, 'adviceGivenControl': true, 'adviceGivenPlanning': true },
                    'ETA': {},
                    'eyesightTest': { 'complete': true, 'seriousFault': false },
                    'manoeuvres': { 'reverseRight': { 'selected': true } },
                    'testRequirements': {
                      'normalStart1': true,
                      'normalStart2': true,
                      'hillStart': true,
                      'angledStart': true,
                    },
                  },
                  'passCompletion': { 'passCertificateNumber': 'A123456X', 'provisionalLicenceProvided': true },
                  'postTestDeclarations': {
                    'healthDeclarationAccepted': true,
                    'passCertificateNumberReceived': true,

                    'postTestSignature': '',
                  },
                  'testSummary': {
                    'routeNumber': 1,
                    'independentDriving': 'Traffic signs',
                    'candidateDescription': '1',
                    'additionalInformation': null,
                    'weatherConditions': ['Snowing'],
                    'debriefWitnessed': true,
                    'D255': false,
                    'identification': 'Licence',
                    'trueLikenessToPhoto': true,
                  },
                  'communicationPreferences': {
                    'updatedEmail': '',
                    'communicationMethod': 'Post',
                    'conductedLanguage': 'English',
                  },
                  'rekey': false,
                  'rekeyDate': null,
                  'rekeyReason': {
                    'ipadIssue': {
                      'selected': false,
                      'broken': false,
                      'lost': false,
                      'technicalFault': false,
                      'stolen': false,
                    }, 'other': { 'selected': false, 'reason': '' }, 'transfer': { 'selected': false },
                  },
                  'delegatedTest': false,
                  'examinerBooked': 1234567,
                  'examinerConducted': 1234567,
                  'examinerKeyed': 1234567,
                  'changeMarker': false,
                },
              },
            },
          },
        }),
      ],
    });
    fixture = TestBed.createComponent(ExaminerRecordsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store$ = TestBed.inject(MockStore);
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
    expect(store$).toBeTruthy();
  });

  describe('ionViewDidEnter', () => {
    it('should dispatch the store with ExaminerStatsViewDidEnter', () => {
      spyOn(component.orientationProvider, 'monitorOrientation').and.callThrough();
      spyOn(component.store$, 'dispatch');

      component.ionViewDidEnter();
      expect(component.store$.dispatch).toHaveBeenCalledWith(ExaminerRecordsViewDidEnter());
    });
  });

  describe('ngOnInit', () => {
    it('should set pageState', () => {
      component.pageState = null;

      component.ngOnInit();
      expect(component.pageState).toBeTruthy();
    });
    it('should call setFilterLists', () => {
      spyOn(component, 'setLocationFilter');

      component.ngOnInit();
      expect(component.setLocationFilter).toHaveBeenCalled();
    });
  });

  fdescribe('setLocationFilter', () => {
    it('should set locationFilterOptions to the item property of each object in locationList$', () => {
      console.log('should set locationFilterOptions to the item property of each object in locationList$')
      spyOn(component, 'ngOnInit');
      component.locationFilterOptions = null;
      component.pageState.locationList$ = of([
        { item: { centreName: '1', centreId: 1, costCode:'X1' }, count: 1 },
        { item: { centreName: '2', centreId: 2, costCode:'X2' }, count: 2 },
      ]);

      component.setLocationFilter();
      expect(component.locationFilterOptions).toEqual([
        { centreName: '1', centreId: 1, costCode:'X1' },
        { centreName: '2', centreId: 2, costCode:'X2' },
      ]);
    });
    it('should set locationPlaceholder to the centreName property ' +
    'of the object in the location array with the highest count', () => {
      console.log('highest count')
      component.locationFilterOptions = null;
      component.pageState.locationList$ = of([
        { item: { centreName: '1', centreId: 1, costCode:'X1' }, count: 1 },
        { item: { centreName: '2', centreId: 2, costCode:'X2' }, count: 2 },
      ]);
      component.setLocationFilter();
      expect(component.locationPlaceholder).toEqual('2');
    });
    it('should call handleLocationFilter with the item of ' +
    'the object in the location array with the highest count', () => {
      console.log('should set locationPlaceholder')

      spyOn(component, 'handleLocationFilter');

      component.locationFilterOptions = null;
      component.pageState.locationList$ = of([
        { item: { centreName: '1', centreId: 1, costCode:'X1' }, count: 1 },
        { item: { centreName: '2', centreId: 2, costCode:'X2' }, count: 2 },
      ]);
      component.setLocationFilter();
      expect(component.handleLocationFilter).toHaveBeenCalledWith({ centreName: '2', centreId: 2, costCode:'X2' });
    });
  });

  describe('setDefault', () => {
    it('should return the value with the highest count within the array', () => {
      expect(component.setDefault(
        [
          { item: 1, count: 1 },
          { item: 2, count: 2 },
        ])).toEqual({ item: 2, count: 2 });
    });
  });

  describe('handleDateFilter', () => {
    it('should set dateFilter to the display of the value passed', () => {
      component.handleDateFilter(
        {
          detail: {
            value:
              {
                display: '1',
              },
          },
        } as CustomEvent,
      );
      expect(component.dateFilter).toEqual('1');
    });
    it('should dispatch DateRangeChanged with dateFilter', () => {
      spyOn(component.store$, 'dispatch');
      component.handleDateFilter(
        {
          detail: {
            value:
              {
                display: '1',
                val: 'today',
              },
          },
        } as CustomEvent,
      );
      expect(component.store$.dispatch).toHaveBeenCalledWith(DateRangeChanged({
        display: '1',
        val: 'today',
      } as SelectableDateRange));
    });
    it('should set rangeSubject to the val property of the value passed', () => {
      spyOn(component.store$, 'dispatch');
      component.handleDateFilter(
        {
          detail: {
            value:
              {
                val: '1',
              },
          },
        } as CustomEvent,
      );
      component.rangeSubject$.subscribe(i => {
        expect(i).toEqual('1');
      });
    });
  });

  describe('handleLocationFilter', () => {
    it('should set locationFilter to centreName of the passed value', () => {
      component.locationFilter = null
      component.handleLocationFilter({ centreName: '1', centreId: 1, costCode: '2' });
      expect(component.locationFilter).toEqual('1');
    });
    it('should set locationSubject$ to centreId of the passed value', () => {
      component.handleLocationFilter({ centreName: '1', centreId: 1, costCode: '2' });
      component.locationSubject$.subscribe((i) => {
        expect(i).toEqual(1);
      });
    });
    it('should dispatch LocationChanged with locationFilter', () => {
      spyOn(component.store$, 'dispatch');

      component.handleLocationFilter({ centreName: '1', centreId: 1, costCode: '2' });
      expect(component.store$.dispatch)
        .toHaveBeenCalledWith(LocationChanged({ centreName: '1', centreId: 1, costCode: '2' }));
    });
  });

  describe('handleCategoryFilter', () => {
    it('should set categoryDisplay to "Test category: B" if the passed value is B', () => {
      component.handleCategoryFilter(TestCategory.B);
      expect(component.categoryDisplay).toEqual('Test category: B');
    });
    it('should set currentCategory to the passed value', () => {
      component.handleCategoryFilter(TestCategory.B);
      expect(component['currentCategory']).toEqual(TestCategory.B);
    });
    it('should set categorySubject$ to the passed value', () => {
      component.handleCategoryFilter(TestCategory.B);
      component.categorySubject$.subscribe((i) => {
        expect(i).toEqual(TestCategory.B);
      });
    });
    it('should dispatch TestCategoryChanged with passed value', () => {
      spyOn(component.store$, 'dispatch');

      component.handleCategoryFilter(TestCategory.B);
      expect(component.store$.dispatch).toHaveBeenCalledWith(TestCategoryChanged(TestCategory.B));
    });
  });

  describe('colourFilterChanged', () => {
    it('should set colourOption to the value passed', () => {
      component.colourOption = component.examinerRecordsProvider.colours.default;
      component.colourFilterChanged(ColourEnum.Monochrome);
      expect(component.colourOption).toEqual(component.examinerRecordsProvider.colours.monochrome);
    });
    it('should dispatch ColourFilterChanged with the colour passed', () => {
      spyOn(component.store$, 'dispatch');
      component.colourFilterChanged(ColourEnum.Monochrome);
      expect(component.store$.dispatch).toHaveBeenCalledWith(ColourFilterChanged(ColourEnum.Monochrome));
    });
  });

  describe('HideChartsChanged', () => {
    it('should flip hideCharts', () => {
      component.hideMainContent = true;
      component.hideChart();
      expect(component.hideMainContent).toEqual(false);
    });
    it('should dispatch the store with HideChartsChanged(true) if hideChart is true after being flipped', () => {
      spyOn(component.store$, 'dispatch');
      component.hideMainContent = false;

      component.hideChart();
      expect(component.store$.dispatch).toHaveBeenCalledWith(HideChartsChanged(true));
    });
    it('should dispatch the store with HideChartsChanged(false) if hideChart is false after being flipped', () => {
      spyOn(component.store$, 'dispatch');
      component.hideMainContent = true;

      component.hideChart();
      expect(component.store$.dispatch).toHaveBeenCalledWith(HideChartsChanged(false));
    });
  });

  describe('showControlledStop', () => {
    it('should return true if currentCategory is in the approved list', () => {
      component['currentCategory'] = TestCategory.B;
      expect(component.showEmergencyStop()).toEqual(true);
    });
    it('should return false if currentCategory is not in the approved list', () => {
      component['currentCategory'] = TestCategory.ADI3;
      expect(component.showEmergencyStop()).toEqual(false);
    });
  });

  describe('accordionSelect', () => {
    it('should flip accordionOpen', () => {
      component.accordionOpen = true;
      component.accordionSelect();
      expect(component.accordionOpen).toEqual(false);
    });
    it('should dispatch the store with AccordionChanged(true) if accordionOpen is true after being flipped', () => {
      spyOn(component.store$, 'dispatch');
      component.accordionOpen = false;

      component.accordionSelect();
      expect(component.store$.dispatch).toHaveBeenCalledWith(AccordionChanged(true));
    });
    it('should dispatch the store with AccordionChanged(false) if accordionOpen is false after being flipped', () => {
      spyOn(component.store$, 'dispatch');
      component.accordionOpen = true;

      component.accordionSelect();
      expect(component.store$.dispatch).toHaveBeenCalledWith(AccordionChanged(false));
    });
  });

});
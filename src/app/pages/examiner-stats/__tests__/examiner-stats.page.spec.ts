import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IonicModule } from '@ionic/angular';
import { ColourEnum, ExaminerStatsPage } from '../examiner-stats.page';
import {
  AccordionChanged,
  ColourFilterChanged,
  DateRangeChanged,
  ExaminerStatsViewDidEnter,
  HideChartsChanged,
  LocationChanged,
  TestCategoryChanged,
} from '@pages/examiner-stats/examiner-stats.actions';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { of } from 'rxjs';

fdescribe('ExaminerStatsPage', () => {
  let component: ExaminerStatsPage;
  let fixture: ComponentFixture<ExaminerStatsPage>;
  let store$: MockStore;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExaminerStatsPage],
      imports: [IonicModule],
      providers: [
        { provide: Store, useClass: MockStore },
        provideMockStore({
          initialState: {
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
    fixture = TestBed.createComponent(ExaminerStatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store$ = TestBed.inject(MockStore);
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
    expect(store$).toBeTruthy();
  });

  describe('blurElement', () => {
    it('should run blur on the active Element if the id does not contain input', () => {
      document.getElementById('chart-toggle-input').focus();
      spyOn(document.activeElement as HTMLElement, 'blur');
      component.blurElement({ id: 'string' } as HTMLElement);
      expect((document.activeElement as HTMLElement).blur).toHaveBeenCalled();
    });
    it('should run blur on the active Element if the id contains input', () => {
      document.getElementById('chart-toggle-input').focus();
      spyOn(document.activeElement as HTMLElement, 'blur');
      component.blurElement({ id: 'input' } as HTMLElement);
      expect((document.activeElement as HTMLElement).blur).not.toHaveBeenCalled();
    });
  });

  describe('calculatePercentage', () => {
    it('should accurately calculate the percentage value of ' +
      'input 1 compared to input 2 to the first decimal place', () => {
      expect(component['calculatePercentage']([11, 1])).toEqual('9.1%');
    });
  });

  describe('ionViewDidEnter', () => {
    it('should dispatch the store with ExaminerStatsViewDidEnter', () => {
      spyOn(component.store$, 'dispatch');

      component.ionViewDidEnter();
      expect(component.store$.dispatch).toHaveBeenCalledWith(ExaminerStatsViewDidEnter());
    });
  });

  describe('ngOnInit', () => {
    it('should set pageState', () => {
      component.pageState = null;

      component.ngOnInit();
      expect(component.pageState).toBeTruthy();
    });
    it('should call setFilterLists', () => {
      spyOn(component, 'setFilterLists');

      component.ngOnInit();
      expect(component.setFilterLists).toHaveBeenCalled();
    });
  });

  xdescribe('setFilterLists', () => {
    it('should set locationFilterOptions to the item property of each object in locationList$', () => {
      component.locationFilterOptions = null;
      component.pageState.locationList$ = of([
        { item: { centreName: '1', centreId: 1, costCode:'X1' }, count: 1 },
        { item: { centreName: '2', centreId: 2, costCode:'X2' }, count: 2 },
      ]);

      component.setFilterLists();
      expect(component.locationFilterOptions).toEqual([
        { centreName: '1', centreId: 1, costCode:'X1' },
        { centreName: '2', centreId: 2, costCode:'X2' },
      ]);
    });
    it('should set locationPlaceholder to the centreName property ' +
    'of the object in the location array with the highest count', () => {
      component.locationFilterOptions = null;
      component.pageState.locationList$ = of([
        { item: { centreName: '1', centreId: 1, costCode:'X1' }, count: 1 },
        { item: { centreName: '2', centreId: 2, costCode:'X2' }, count: 2 },
      ]);
      component.setFilterLists();
      expect(component.locationPlaceholder).toEqual('2');
    });
    it('should call handleLocationFilter with the item of ' +
    'the object in the location array with the highest count', () => {
      spyOn(component, 'handleLocationFilter');

      component.locationFilterOptions = null;
      component.pageState.locationList$ = of([
        { item: { centreName: '1', centreId: 1, costCode:'X1' }, count: 1 },
        { item: { centreName: '2', centreId: 2, costCode:'X2' }, count: 2 },
      ]);
      component.setFilterLists();
      expect(component.handleLocationFilter).toHaveBeenCalledWith({ centreName: '2', centreId: 2, costCode:'X2' });
    });

    // it('should set categoryFilterOptions to the item property of each object in categoryList$', () => {
    //   component.categoryFilterOptions = null;
    //   component.pageState.categoryList$ = of([
    //     { item: TestCategory.B, count: 1 },
    //     { item: TestCategory.ADI3, count: 2 },
    //   ]);
    //
    //   component.setFilterLists();
    //   expect(1).toEqual(1);
    //   expect(component.categoryFilterOptions).toEqual([
    //     TestCategory.B,
    //     TestCategory.ADI3,
    //   ]);
    // });
    // it('should set categoryPlaceholder to the property ' +
    // 'of the object in the category array with the highest count', () => {
    //   component.categoryFilterOptions = null;
    //   component.pageState.categoryList$ = of([
    //     { item: TestCategory.B, count: 1 },
    //     { item: TestCategory.ADI3, count: 2 },
    //   ]);
    //
    //   component.setFilterLists();
    //   expect(component.categoryPlaceholder).toEqual(TestCategory.ADI3);
    // });
    // it('should call handleCategoryFilter with the item of ' +
    // 'the object in the category array with the highest count', () => {
    //   spyOn(component, 'handleCategoryFilter');
    //
    //   component.categoryFilterOptions = null;
    //   component.pageState.categoryList$ = of([
    //     { item: TestCategory.B, count: 1 },
    //     { item: TestCategory.ADI3, count: 2 },
    //   ]);
    //
    //   component.setFilterLists();
    //   expect(component.handleCategoryFilter).toHaveBeenCalledWith(TestCategory.ADI3);
    // });
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
              },
          },
        } as CustomEvent,
      );
      expect(component.store$.dispatch).toHaveBeenCalledWith(DateRangeChanged('1'));
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
      expect(component.store$.dispatch).toHaveBeenCalledWith(LocationChanged('1'));
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
      component.colourOption = ColourEnum.Default;
      component.colourFilterChanged(ColourEnum.Navy);
      expect(component.colourOption).toEqual(ColourEnum.Navy);
    });
    it('should dispatch ColourFilterChanged with the colour passed', () => {
      spyOn(component.store$, 'dispatch');

      component.colourFilterChanged(ColourEnum.Navy);
      expect(component.store$.dispatch).toHaveBeenCalledWith(ColourFilterChanged(ColourEnum.Navy));
    });
  });

  describe('toggleChart', () => {
    it('should flip hideChart', () => {
      component.hideChart = true;
      component.toggleChart();
      expect(component.hideChart).toEqual(false);
    });
    it('should dispatch the store with HideChartsChanged(true) if hideChart is true after being flipped', () => {
      spyOn(component.store$, 'dispatch');
      component.hideChart = false;

      component.toggleChart();
      expect(component.store$.dispatch).toHaveBeenCalledWith(HideChartsChanged(true));
    });
    it('should dispatch the store with HideChartsChanged(false) if hideChart is false after being flipped', () => {
      spyOn(component.store$, 'dispatch');
      component.hideChart = true;

      component.toggleChart();
      expect(component.store$.dispatch).toHaveBeenCalledWith(HideChartsChanged(false));
    });
  });

  describe('handleChartFilter', () => {
    it('should set globalChartType to the value passed', () => {
      component.globalChartType = 'bar';
      component.handleChartFilter({ detail: { value: 'pie' } });
      expect(component.globalChartType).toEqual('pie');
    });
  });

  describe('colourSelect', () => {
    it('should return colors.default.pie if the colourOption ' +
      'is not within the switch options and the input is not bar', () => {
      component.colourOption = null;
      expect(component.colourSelect('pie')).toEqual(component.colors.default.pie);
    });
    it('should return colors.default.pie if the colourOption is Default and the input is not bar', () => {
      component.colourOption = ColourEnum.Default;
      expect(component.colourSelect('pie')).toEqual(component.colors.default.pie);
    });
    it('should return colors.default.bar if the colourOption is Default and the input is bar', () => {
      component.colourOption = ColourEnum.Default;
      expect(component.colourSelect('bar')).toEqual(component.colors.default.bar);
    });
    it('should return colors.monochrome.pie if the colourOption is Monochrome and the input is not bar', () => {
      component.colourOption = ColourEnum.Monochrome;
      expect(component.colourSelect('pie')).toEqual(component.colors.monochrome.pie);
    });
    it('should return colors.monochrome.bar if the colourOption is Monochrome and the input is bar', () => {
      component.colourOption = ColourEnum.Monochrome;
      expect(component.colourSelect('bar')).toEqual(component.colors.monochrome.bar);
    });
    it('should return colors.amethyst if the colourOption is Amethyst', () => {
      component.colourOption = ColourEnum.Amethyst;
      expect(component.colourSelect('bar')).toEqual(component.colors.amethyst);
    });
    it('should return colors.navy if the colourOption is Navy', () => {
      component.colourOption = ColourEnum.Navy;
      expect(component.colourSelect('bar')).toEqual(component.colors.navy);
    });
  });

  describe('filterDataForGrid', () => {
    it('should return an array filled with object values of the object passed in', () => {
      component['currentCategory'] = TestCategory.B;
      expect(component.filterDataForGrid([
        { item: 'value1', count: 1, percentage: '1' },
        { item: 'value2', count: 2, percentage: '2' }])).toEqual([['value1', 1, '1'], ['value2', 2, '2']]);
    });
    it('should return an empty array if nothing is passed into the function', () => {
      expect(component.filterDataForGrid(null)).toEqual([[]]);
    });
  });

  describe('getTotal', () => {
    it('should return the total counts of the array passed in', () => {
      expect(component.getTotal([
        { count: 1, percentage: '1%', item: '1' },
        { count: 8, percentage: '1%', item: '1' },
      ])).toEqual(9);
    });
  });

  describe('getLabelColour', () => {
    it('should return #FFFFFF if type is bar and the passed value is colors.navy', () => {
      expect(component.getLabelColour(component.colors.navy, 'bar')).toEqual('#FFFFFF');
    });
    it('should return #000000 if type is not bar and the passed value is colors.navy', () => {
      expect(component.getLabelColour(component.colors.navy, 'pie')).toEqual('#000000');
    });
    it('should return #000000 if the passed value is not colors.navy', () => {
      expect(component.getLabelColour(component.colors.amethyst, 'pie')).toEqual('#000000');
    });
  });

  describe('showControlledStop', () => {
    it('should return true if currentCategory is in the approved list', () => {
      component['currentCategory'] = TestCategory.B;
      expect(component.showControlledStop()).toEqual(true);
    });
    it('should return false if currentCategory is not in the approved list', () => {
      component['currentCategory'] = TestCategory.ADI3;
      expect(component.showControlledStop()).toEqual(false);
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

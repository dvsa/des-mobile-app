import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { ExaminerRecordModel } from '@dvsa/mes-microservice-common/domain/examiner-records';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonicModule } from '@ionic/angular';
import { ScrollDetail } from '@ionic/core';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  ClickDataCard,
  ColourFilterChanged,
  DateRangeChanged,
  ExaminerRecordsViewDidEnter,
  GetExaminerRecords,
  HideChartsChanged,
  LoadingExaminerRecords,
  LocationChanged,
  TestCategoryChanged,
} from '@pages/examiner-records/examiner-records.actions';
import { DASHBOARD_PAGE } from '@pages/page-names.constants';
import { CompressionProvider } from '@providers/compression/compression';
import { ExaminerRecordsProviderMock } from '@providers/examiner-records/__mocks__/examiner-records.mock';
import { ColourEnum, ExaminerRecordsProvider, SelectableDateRange } from '@providers/examiner-records/examiner-records';
import { SearchProviderMock } from '@providers/search/__mocks__/search.mock';
import { SearchProvider } from '@providers/search/search';
import { DateRange } from '@shared/helpers/date-time';
import { selectCachedExaminerRecords, selectLastCachedDate } from '@store/examiner-records/examiner-records.selectors';
import moment from 'moment';
import { Subscription, of } from 'rxjs';
import { ExaminerRecordsPage, ExaminerRecordsPageStateData } from '../examiner-records.page';
import {CommonModule} from '@angular/common';
import {MockComponent} from 'ng-mocks';
import {ColourFilterRadioComponent} from '@pages/examiner-records/components/colour-filter-radio/colour-filter-radio';

describe('ExaminerRecordsPage', () => {
  let component: ExaminerRecordsPage;
  let fixture: ComponentFixture<ExaminerRecordsPage>;
  let store$: MockStore;
  const initialState = {
    cachedRecords$: of([]),
    isLoadingRecords$: of(false),
    routeNumbers$: of([]),
    manoeuvres$: of([]),
    balanceQuestions$: of([]),
    safetyQuestions$: of([]),
    independentDriving$: of([]),
    showMeQuestions$: of([]),
    tellMeQuestions$: of([]),
    testCount$: of(0),
    circuits$: of([]),
    locationList$: of([]),
    categoryList$: of([]),
    emergencyStops$: of([]),
  };
  const mockTests: ExaminerRecordModel[] = [
    {
      testCategory: TestCategory.B,
      testCentre: {
        centreId: 3,
        centreName: 'Cardiff',
        costCode: 'CF1',
      },
      routeNumber: 1,
      startDate: moment(Date.now()).subtract(1, 'days').format('YYYY-MM-DD'),
    },
    {
      testCategory: TestCategory.C,
      testCentre: {
        centreId: 4,
        centreName: 'Swansea',
        costCode: 'SW1',
      },
      routeNumber: 2,
      startDate: moment(Date.now()).subtract(10, 'days').format('YYYY-MM-DD'),
    },
    {
      testCategory: TestCategory.C,
      testCentre: {
        centreId: 4,
        centreName: 'Swansea',
        costCode: 'SW1',
      },
      routeNumber: 3,
      startDate: moment(Date.now()).format('YYYY-MM-DD'),
    },
  ] as ExaminerRecordModel[];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExaminerRecordsPage, MockComponent(ColourFilterRadioComponent)],
      imports: [IonicModule, CommonModule],
      providers: [
        { provide: ExaminerRecordsProvider, useClass: ExaminerRecordsProviderMock },
        CompressionProvider,
        { provide: SearchProvider, useClass: SearchProviderMock },
        { provide: Store, useClass: MockStore },
        provideMockStore({
          initialState: {
            appInfo: { employeeId: '1' },
            examinerRecords: {
              colourScheme: ColourEnum.DEFAULT,
              cachedRecords: null,
              isLoading: false,
              lastUpdatedTime: null,
            },
            tests: {
              startedTests: {
                1: {
                  appVersion: '4.10.0.0',
                  version: '3.42.5',
                  category: 'B',
                  activityCode: '11',
                  journalData: {
                    examiner: { staffNumber: '1234567', individualId: 9000001 },
                    testCentre: { centreId: 54322, costCode: 'EXTC1', centreName: 'Example Test Centre' },
                    testSlotAttributes: {
                      welshTest: false,
                      slotId: 5137,
                      start: new Date(Date.now()).toString(),
                      specialNeeds: false,
                      specialNeedsCode: 'EXTRA',
                      specialNeedsArray: ['None'],
                      vehicleTypeCode: 'C',
                      extendedTest: false,
                      examinerVisiting: false,
                      previousCancellation: ['Act of nature'],
                      entitlementCheck: false,
                      categoryEntitlementCheck: false,
                      fitMarker: false,
                      slotType: 'Extra Time Needed',
                    },
                    candidate: {
                      candidateAddress: {
                        addressLine1: '2345 Station Street',
                        addressLine2: 'Someplace',
                        addressLine3: 'Sometown',
                        postcode: 'AB12 3CD',
                      },
                      candidateId: 126,
                      candidateName: { firstName: 'test', lastName: 'data', title: 'Mr' },
                      driverNumber: 'COOPE015220A99HC',
                      mobileTelephone: '07654 123456',
                      primaryTelephone: '01234 567890',
                      secondaryTelephone: '04321 098765',
                      dateOfBirth: '1974-09-14',
                      ethnicityCode: 'E',
                      gender: 'F',
                    },
                    applicationReference: { applicationId: 20654332, bookingSequence: 3, checkDigit: 1 },
                  },
                  preTestDeclarations: {
                    insuranceDeclarationAccepted: true,
                    residencyDeclarationAccepted: true,
                    preTestSignature: '',
                    candidateDeclarationSigned: false,
                  },
                  accompaniment: {},
                  vehicleDetails: {
                    registrationNumber: '1',
                    gearboxCategory: 'Manual',
                    motStatus: 'No details found',
                  },
                  instructorDetails: {},
                  testData: {
                    drivingFaults: { moveOffSafety: 1, moveOffControl: 1 },
                    dangerousFaults: {},
                    seriousFaults: {},
                    vehicleChecks: {
                      tellMeQuestion: { code: 'T6', description: 'Antilock braking system', outcome: 'P' },
                      showMeQuestion: { outcome: 'P', code: 'S1', description: 'Rear windscreen' },
                    },
                    controlledStop: { selected: false },
                    eco: { completed: true, adviceGivenControl: true, adviceGivenPlanning: true },
                    ETA: {},
                    eyesightTest: { complete: true, seriousFault: false },
                    manoeuvres: { reverseRight: { selected: true } },
                    testRequirements: {
                      normalStart1: true,
                      normalStart2: true,
                      hillStart: true,
                      angledStart: true,
                    },
                  },
                  passCompletion: { passCertificateNumber: 'A123456X', provisionalLicenceProvided: true },
                  postTestDeclarations: {
                    healthDeclarationAccepted: true,
                    passCertificateNumberReceived: true,

                    postTestSignature: '',
                  },
                  testSummary: {
                    routeNumber: 1,
                    independentDriving: 'Traffic signs',
                    candidateDescription: '1',
                    additionalInformation: null,
                    weatherConditions: ['Snowing'],
                    debriefWitnessed: true,
                    D255: false,
                    identification: 'Licence',
                    trueLikenessToPhoto: true,
                  },
                  communicationPreferences: {
                    updatedEmail: '',
                    communicationMethod: 'Post',
                    conductedLanguage: 'English',
                  },
                  rekey: false,
                  rekeyDate: null,
                  rekeyReason: {
                    ipadIssue: {
                      selected: false,
                      broken: false,
                      lost: false,
                      technicalFault: false,
                      stolen: false,
                    },
                    other: { selected: false, reason: '' },
                    transfer: { selected: false },
                  },
                  delegatedTest: false,
                  examinerBooked: 1234567,
                  examinerConducted: 1234567,
                  examinerKeyed: 1234567,
                  changeMarker: false,
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
    spyOn(component.store$, 'dispatch');

    component.pageState = initialState;
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
    expect(store$).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize testResults and update testSubject$', async () => {
      spyOn(component, 'removeDuplicatesAndSort').and.returnValue(mockTests);
      spyOn(component.testSubject$, 'next');

      await component.ngOnInit();

      expect(component.removeDuplicatesAndSort).toHaveBeenCalledWith(component.getLocalResults());
      expect(component.testSubject$.next).toHaveBeenCalledWith(mockTests);
    });

    it('should set default date filter', async () => {
      spyOn(component, 'handleDateFilter');

      await component.ngOnInit();

      expect(component.handleDateFilter).toHaveBeenCalledWith({
        detail: { value: component.defaultDate },
      } as CustomEvent);
    });

    it('should set categorySelectPristine to false if categorySubject$ has value', async () => {
      component.categorySubject$.next(TestCategory.B);

      await component.ngOnInit();

      expect(component.categorySelectPristine).toBeFalse();
    });

    it('should set locationSelectPristine to false if locationSubject$ has value', async () => {
      component.locationSubject$.next(1);

      await component.ngOnInit();

      expect(component.locationSelectPristine).toBeFalse();
    });

    it('should set location filter and fetch online records', async () => {
      spyOn(component, 'setLocationFilter');
      spyOn(component, 'getOnlineRecords');

      await component.ngOnInit();

      expect(component.setLocationFilter).toHaveBeenCalled();
      expect(component.getOnlineRecords).toHaveBeenCalled();
    });
  });

  describe('handleScroll', () => {
    it('should set displayScrollBanner to true when scrollTop is greater than 203', () => {
      component.displayScrollBanner = false;
      component.handleScroll({ detail: { scrollTop: 205 } } as CustomEvent<ScrollDetail>);
      expect(component.displayScrollBanner).toBe(true);
    });

    it('should set displayScrollBanner to false when scrollTop is less than or equal to 203', () => {
      component.displayScrollBanner = true;
      component.handleScroll({ detail: { scrollTop: 203 } } as CustomEvent<ScrollDetail>);
      expect(component.displayScrollBanner).toBe(false);
    });
  });

  describe('setupCategorySelectList', () => {
    it('should add every completed category to categoryFilterOptions', () => {
      const categories = [
        { item: TestCategory.B, count: 1 },
        { item: TestCategory.C, count: 2 },
      ];
      component.setupCategorySelectList(categories);
      expect(component.categoryFilterOptions).toEqual([TestCategory.B, TestCategory.C]);
    });

    it('should set the most common category as the default if current category is not included', () => {
      const categories = [
        { item: TestCategory.B, count: 1 },
        { item: TestCategory.C, count: 2 },
      ];
      spyOn(component, 'setDefault').and.returnValue(categories[1]);
      spyOn(component, 'handleCategoryFilter');

      component.categorySubject$.next(TestCategory.A);
      component.setupCategorySelectList(categories);
      expect(component.categoryPlaceholder).toEqual(TestCategory.C);
      expect(component.handleCategoryFilter).toHaveBeenCalledWith(TestCategory.C);
    });

    it('should call changeEligibleTests if current category is included in categoryFilterOptions', () => {
      const categories = [
        { item: TestCategory.B, count: 1 },
        { item: TestCategory.C, count: 2 },
      ];
      component.categorySubject$.next(TestCategory.B);
      spyOn(component, 'changeEligibleTests');
      component.setupCategorySelectList(categories);
      expect(component.changeEligibleTests).toHaveBeenCalled();
    });

    it('should set categorySelectPristine to true if most common category is set as default', () => {
      const categories = [
        { item: TestCategory.B, count: 1 },
        { item: TestCategory.C, count: 2 },
      ];
      spyOn(component, 'setDefault').and.returnValue(categories[1]);
      component.categorySubject$.next(TestCategory.A);
      component.setupCategorySelectList(categories);
      expect(component.categorySelectPristine).toBeTrue();
    });

    it('should not set categorySelectPristine if current category is included in categoryFilterOptions', () => {
      component.categorySelectPristine = false;
      const categories = [
        { item: TestCategory.B, count: 1 },
        { item: TestCategory.C, count: 2 },
      ];
      component.categorySubject$.next(TestCategory.B);
      spyOn(component, 'changeEligibleTests');
      component.setupCategorySelectList(categories);
      expect(component.categorySelectPristine).toEqual(false);
    });
  });

  describe('setupLocationSelectList', () => {
    it('should add every visited location to locationFilterOptions', () => {
      const locations = [
        { item: { centreName: 'Centre 1', centreId: 1, costCode: 'X1' }, count: 1 },
        { item: { centreName: 'Centre 2', centreId: 2, costCode: 'X2' }, count: 2 },
      ];
      component.setupLocationSelectList(locations);
      expect(component.locationFilterOptions).toEqual([
        { centreName: 'Centre 1', centreId: 1, costCode: 'X1' },
        { centreName: 'Centre 2', centreId: 2, costCode: 'X2' },
      ]);
    });

    it('should display cost code or centre id if centre name is not available', () => {
      const locations = [
        { item: { centreName: null, centreId: 1, costCode: 'X1' }, count: 1 },
        { item: { centreName: null, centreId: 2, costCode: null }, count: 2 },
      ];
      component.setupLocationSelectList(locations);
      expect(component.locationFilterOptions).toEqual([
        { centreName: 'Limited details - X1', centreId: 1, costCode: 'X1' },
        { centreName: 'Limited details - 2', centreId: 2, costCode: null },
      ]);
    });

    it('should set the most common location as the default if current location is not included', () => {
      const locations = [
        { item: { centreName: 'Centre 1', centreId: 1, costCode: 'X1' }, count: 1 },
        { item: { centreName: 'Centre 2', centreId: 2, costCode: 'X2' }, count: 2 },
      ];
      spyOn(component, 'setDefault').and.returnValue(locations[1]);
      spyOn(component, 'handleLocationFilter');

      component.locationSubject$.next(3);
      component.setupLocationSelectList(locations);
      expect(component.locationPlaceholder).toEqual('Centre 2');
      expect(component.handleLocationFilter).toHaveBeenCalledWith(locations[1].item);
    });

    it('should set locationPlaceholder to an empty string if locations array is empty', () => {
      const locations = [];
      spyOn(component, 'handleLocationFilter');

      component.setupLocationSelectList(locations);
      expect(component.locationPlaceholder).toEqual('');
      expect(component.handleLocationFilter).toHaveBeenCalledWith({ centreId: null, centreName: '', costCode: '' });
    });
  });

  describe('setLocationFilter', () => {
    it('should set locationFilterOptions to the item property of each object in locationList$', () => {
      spyOn(component, 'ngOnInit');
      component.locationFilterOptions = null;
      component.pageState.locationList$ = of([
        { item: { centreName: '1', centreId: 1, costCode: 'X1' }, count: 1 },
        { item: { centreName: '2', centreId: 2, costCode: 'X2' }, count: 2 },
      ]);

      component.setLocationFilter();
      expect(component.locationFilterOptions).toEqual([
        { centreName: '1', centreId: 1, costCode: 'X1' },
        { centreName: '2', centreId: 2, costCode: 'X2' },
      ]);
    });
    it(
      'should set locationPlaceholder to the centreName property ' +
        'of the object in the location array with the highest count',
      () => {
        spyOn(component, 'ngOnInit');
        component.locationFilterOptions = null;
        component.pageState.locationList$ = of([
          { item: { centreName: '1', centreId: 1, costCode: 'X1' }, count: 1 },
          { item: { centreName: '2', centreId: 2, costCode: 'X2' }, count: 2 },
        ]);
        component.setLocationFilter();
        expect(component.locationPlaceholder).toEqual('2');
      }
    );
    it(
      'should call handleLocationFilter with the item of ' + 'the object in the location array with the highest count',
      () => {
        spyOn(component, 'ngOnInit');

        spyOn(component, 'handleLocationFilter');

        component.locationFilterOptions = null;
        component.pageState.locationList$ = of([
          { item: { centreName: '1', centreId: 1, costCode: 'X1' }, count: 1 },
          { item: { centreName: '2', centreId: 2, costCode: 'X2' }, count: 2 },
        ]);
        component.setLocationFilter();
        expect(component.handleLocationFilter).toHaveBeenCalledWith({ centreName: '2', centreId: 2, costCode: 'X2' });
      }
    );
  });

  describe('setDefault', () => {
    it('should return the value with the highest count within the array', () => {
      expect(
        component.setDefault([
          { item: 1, count: 1 },
          { item: 2, count: 2 },
        ])
      ).toEqual({ item: 2, count: 2 });
    });
  });

  describe('handleDateFilter', () => {
    it('should set dateFilter to the display of the value passed', () => {
      component.handleDateFilter({
        detail: {
          value: {
            display: '1',
          },
        },
      } as CustomEvent);
      expect(component.dateFilter).toEqual('1');
    });
    it('should dispatch DateRangeChanged with dateFilter', () => {
      component.handleDateFilter({
        detail: {
          value: {
            display: '1',
            val: 'today',
          },
        },
      } as CustomEvent);
      expect(component.store$.dispatch).toHaveBeenCalledWith(
        DateRangeChanged({
          display: '1',
          val: 'today',
        } as SelectableDateRange)
      );
    });
    it('should set rangeSubject to the val property of the value passed', () => {
      component.handleDateFilter({
        detail: {
          value: {
            val: '1',
          },
        },
      } as CustomEvent);
      component.rangeSubject$.subscribe((i) => {
        expect(i).toEqual('1');
      });
    });
  });

  describe('handleLocationFilter', () => {
    it('should set locationFilter to the passed value', () => {
      component.locationFilter = { centreId: null, centreName: null, costCode: null };
      component.handleLocationFilter({ centreName: '1', centreId: 1, costCode: '2' }, true);
      expect(component.locationFilter).toEqual({ centreName: '1', centreId: 1, costCode: '2' });
      expect(component.locationSelectPristine).toEqual(false);
    });
    it('should set locationSubject$ to centreId of the passed value', () => {
      component.handleLocationFilter({ centreName: '1', centreId: 1, costCode: '2' });
      component.locationSubject$.subscribe((i) => {
        expect(i).toEqual(1);
        expect(component.locationSelectPristine).toEqual(true);
      });
    });
    it('should dispatch LocationChanged with locationFilter', () => {
      component.handleLocationFilter({ centreName: '1', centreId: 1, costCode: '2' });
      expect(component.store$.dispatch).toHaveBeenCalledWith(
        LocationChanged({ centreName: '1', centreId: 1, costCode: '2' })
      );
    });
  });

  describe('getOnlineRecords', () => {
    it(
      'should dispatch LoadingExaminerRecords and GetExaminerRecords actions when ' +
        'cached records are not available or last cached date is different',
      () => {
        store$.overrideSelector(selectCachedExaminerRecords, null);
        store$.overrideSelector(selectLastCachedDate, 'some other date');

        component.getOnlineRecords();

        expect(store$.dispatch).toHaveBeenCalledWith(LoadingExaminerRecords());
        expect(store$.dispatch).toHaveBeenCalledWith(GetExaminerRecords('1'));
      }
    );

    it('should not dispatch any actions when cached records are available and last cached date is today', () => {
      store$.overrideSelector(selectCachedExaminerRecords, [{} as ExaminerRecordModel]);
      store$.overrideSelector(selectLastCachedDate, moment(Date.now()).format('DD/MM/YYYY'));

      component.getOnlineRecords();

      expect(store$.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('changeEligibleTests', () => {
    it('should update eligTestSubject$ with the result of getEligibleTests', () => {
      component.testSubject$.next(mockTests);
      component.categorySubject$.next(TestCategory.C);
      component.rangeSubject$.next(DateRange.WEEK);
      component.locationSubject$.next(4);

      component.changeEligibleTests();

      expect(component.eligTestSubject$.value).toEqual([mockTests[2]]);
    });
  });

  describe('filterDates', () => {
    it('should update testsInRangeSubject$ with the result of getEligibleTests', () => {
      component.testSubject$.next(mockTests);
      component.rangeSubject$.next(DateRange.WEEK);

      component.filterDates();

      expect(component.testsInRangeSubject$.value).toEqual([mockTests[0], mockTests[2]]);
    });
  });

  describe('getTestsByParameters', () => {
    it('should apply provided function to eligible tests and category', () => {
      const mockFn = (tests: ExaminerRecordModel[], category: string) => {
        return tests.filter((test) => test.testCategory === category);
      };

      component.eligTestSubject$.next(mockTests);
      component.categorySubject$.next(TestCategory.B);

      component.getTestsByParameters(mockFn).subscribe((result) => {
        expect(result).toEqual([mockTests[0]]);
      });
    });
  });

  describe('handleCategoryFilter', () => {
    it('should set categoryDisplay to "Test category: B" if the passed value is B', () => {
      component.handleCategoryFilter(TestCategory.B, true);
      expect(component.categoryDisplay).toEqual('Test category: B');
      expect(component.categorySelectPristine).toEqual(false);
    });
    it('should set currentCategory to the passed value', () => {
      component.handleCategoryFilter(TestCategory.B);
      expect(component['currentCategory']).toEqual(TestCategory.B);
      expect(component.categorySelectPristine).toEqual(true);
    });
    it('should set categorySubject$ to the passed value', () => {
      component.handleCategoryFilter(TestCategory.B);
      component.categorySubject$.subscribe((i) => {
        expect(i).toEqual(TestCategory.B);
      });
    });
    it('should dispatch TestCategoryChanged with passed value', () => {
      component.handleCategoryFilter(TestCategory.B);
      expect(component.store$.dispatch).toHaveBeenCalledWith(TestCategoryChanged(TestCategory.B));
    });
  });

  describe('colourFilterChanged', () => {
    it('should set colourOption to the value passed', () => {
      component.colourOption = component.examinerRecordsProvider.colours.default;
      component.colourFilterChanged(ColourEnum.GREYSCALE);
      expect(component.colourOption).toEqual(component.examinerRecordsProvider.colours.greyscale);
    });
    it('should dispatch ColourFilterChanged with the colour passed', () => {
      component.colourFilterChanged(ColourEnum.GREYSCALE);
      expect(component.store$.dispatch).toHaveBeenCalledWith(ColourFilterChanged(ColourEnum.GREYSCALE));
    });
  });

  describe('HideChartsChanged', () => {
    it('should flip hideCharts', () => {
      component.hideMainContent = true;
      component.hideChart();
      expect(component.hideMainContent).toEqual(false);
    });
    it('should dispatch the store with HideChartsChanged(true) if hideChart is true after being flipped', () => {
      component.hideMainContent = false;

      component.hideChart();
      expect(component.store$.dispatch).toHaveBeenCalledWith(HideChartsChanged(true));
    });
    it('should dispatch the store with HideChartsChanged(false) if hideChart is false after being flipped', () => {
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

  describe('goToDashboard', () => {
    it('should navigate back to the dashboard page', () => {
      spyOn(component.router, 'navigate').and.callThrough();
      component.goToDashboard();
      expect(component.router.navigate).toHaveBeenCalledWith([DASHBOARD_PAGE], { replaceUrl: true });
    });
  });

  describe('isMod1', () => {
    it('should return true if the category is a version of mod 1', () => {
      component.currentCategory = TestCategory.EUA1M1;
      expect(component.isMod1()).toEqual(true);
    });
    it('should return false if the category is not a version of mod 1', () => {
      component.currentCategory = TestCategory.B;
      expect(component.isMod1()).toEqual(false);
    });
  });

  describe('isBike', () => {
    it('should return true if the category is a version of a bike test', () => {
      component.currentCategory = TestCategory.EUAM2;
      expect(component.isBike()).toEqual(true);
    });
    it('should return false if the category is not a version of a bike test', () => {
      component.currentCategory = TestCategory.B;
      expect(component.isBike()).toEqual(false);
    });
  });

  describe('ionViewDidEnter', () => {
    it('should monitor orientation and fire entry analytic', () => {
      spyOn(component.orientationProvider, 'monitorOrientation').and.callThrough();
      component.ionViewDidEnter();
      expect(component.orientationProvider.monitorOrientation).toHaveBeenCalled();
      expect(component.store$.dispatch).toHaveBeenCalledWith(ExaminerRecordsViewDidEnter());
    });
  });

  describe('ionViewWillLeave', () => {
    it('should remove all listeners from screen orientation', () => {
      spyOn(ScreenOrientation, 'removeAllListeners').and.callThrough();
      component.ionViewWillLeave();
      expect(ScreenOrientation.removeAllListeners).toHaveBeenCalled();
    });
    it('should unsubscribe from the subscription if there is one', () => {
      component.subscription = new Subscription();
      spyOn(component.subscription, 'unsubscribe');
      component.ionViewWillLeave();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('accordionSelect', () => {
    it('should flip accordionOpen to false if it started as true', () => {
      component.accordionOpen = true;
      component.accordionSelect();
      expect(component.accordionOpen).toEqual(false);
    });
    it('should flip accordionOpen to true if it started as false', () => {
      component.accordionOpen = false;
      component.accordionSelect();
      expect(component.accordionOpen).toEqual(true);
    });
  });

  describe('cardClicked', () => {
    it('should dispatch the store', () => {
      component.cardClicked({ isExpanded: false, title: 'test' });
      expect(component.store$.dispatch).toHaveBeenCalledWith(ClickDataCard({ isExpanded: false, title: 'test' }));
    });
  });

  describe('displayNoDataCard', () => {
    it('should return true when all data grids are empty', () => {
      const emptyData: ExaminerRecordsPageStateData = {
        routeGrid: [],
        manoeuvresGrid: [],
        showMeQuestionsGrid: [],
        independentDrivingGrid: [],
        tellMeQuestionsGrid: [],
        safetyGrid: [],
        balanceGrid: [],
        testCount: 0,
        emergencyStops: [],
        circuits: [],
        locationList: [],
        categoryList: [],
      };
      expect(component.displayNoDataCard(emptyData)).toBeTrue();
    });

    it('should return false when any data grid has items', () => {
      const dataWithItems: ExaminerRecordsPageStateData = {
        routeGrid: [],
        manoeuvresGrid: [],
        showMeQuestionsGrid: [],
        independentDrivingGrid: [],
        tellMeQuestionsGrid: [],
        safetyGrid: [],
        balanceGrid: [],
        testCount: 1,
        emergencyStops: [],
        circuits: [],
        locationList: [{ item: { centreName: 'Test Centre 1', centreId: 1, costCode: 'TC1' }, count: 1 }],
        categoryList: [{ item: TestCategory.B, count: 1 }],
      };

      spyOn(component, 'getTotal').and.returnValue(1);
      expect(component.displayNoDataCard(dataWithItems)).toBeFalse();
    });

    it('should return true when categoryList and locationList are empty', () => {
      const data: ExaminerRecordsPageStateData = {
        routeGrid: [{ item: 'Route 1', count: 1, percentage: '10%' }],
        manoeuvresGrid: [],
        showMeQuestionsGrid: [],
        independentDrivingGrid: [],
        tellMeQuestionsGrid: [],
        safetyGrid: [],
        balanceGrid: [],
        testCount: 1,
        emergencyStops: [],
        circuits: [],
        locationList: [],
        categoryList: [],
      };
      expect(component.displayNoDataCard(data)).toBeTrue();
    });
  });

  describe('getLabelText', () => {
    it('should return correct label text for single test', () => {
      component.pageState.testCount$ = of(1);
      spyOn(component.accessibilityService, 'getTextZoomClass').and.returnValue('text-zoom-large');

      component.currentCategory = 'B';
      component.startDateFilter = '01/01/2021';
      component.endDateFilter = '31/01/2021';
      component.locationFilter = { centreName: 'Test Centre 1', centreId: 1, costCode: 'TC1' };

      const expectedText =
        'Displaying <strong>1</strong> Category <strong>B</strong>' +
        ' test, from <strong>01/01/2021</strong> to <strong>31/01/2021</strong><ion-text> <br />' +
        '</ion-text> at <strong>Test Centre 1</strong>';
      expect(component.getLabelText()).toEqual(expectedText);
    });

    it('should return correct label text for multiple tests', () => {
      component.pageState.testCount$ = of(2);
      spyOn(component.accessibilityService, 'getTextZoomClass').and.returnValue('text-zoom-large');

      component.currentCategory = 'C';
      component.startDateFilter = '01/02/2021';
      component.endDateFilter = '28/02/2021';
      component.locationFilter = { centreName: 'Test Centre 2', centreId: 2, costCode: 'TC2' };

      const expectedText =
        'Displaying <strong>2</strong> Category <strong>C</strong>' +
        ' test<ion-text>s</ion-text>, from <strong>01/02/2021</strong> to <strong>28/02/2021</strong>' +
        '<ion-text> <br /></ion-text> at <strong>Test Centre 2</strong>';
      expect(component.getLabelText()).toEqual(expectedText);
    });

    it('should not include line break for extra large text', () => {
      component.pageState.testCount$ = of(1);
      spyOn(component.accessibilityService, 'getTextZoomClass').and.returnValue('text-zoom-x-large');

      component.currentCategory = 'C';
      component.startDateFilter = '01/02/2021';
      component.endDateFilter = '28/02/2021';
      component.locationFilter = { centreName: 'Test Centre 2', centreId: 2, costCode: 'TC2' };

      const expectedText =
        'Displaying <strong>1</strong> Category <strong>C</strong>' +
        ' test, from <strong>01/02/2021</strong> to <strong>28/02/2021</strong> at <strong>Test Centre 2</strong>';
      expect(component.getLabelText()).toEqual(expectedText);
    });
  });
});

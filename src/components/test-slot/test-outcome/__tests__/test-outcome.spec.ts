import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { SlotDetail } from '@dvsa/mes-journal-schema';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Router } from '@angular/router';

import { LogHelper } from '@providers/logs/logs-helper';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { CAT_A_MOD1, CAT_A_MOD2, CAT_B, CAT_C, CAT_D, TestFlowPageNames } from '@pages/page-names.constants';
import { StoreModel } from '@shared/models/store.model';
import { DateTime, Duration } from '@shared/helpers/date-time';
import { ActivityCodes } from '@shared/models/activity-codes';
import { ActivateTest, StartTest } from '@store/tests/tests.actions';
import { ContinueUnuploadedTest } from '@pages/unuploaded-tests/unuploaded-tests.actions';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { JournalModel } from '@store/journal/journal.model';
import { AppComponent } from '@app/app.component';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { CategoryWhitelistProvider } from '@providers/category-whitelist/category-whitelist';

import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { AccessibilityServiceMock } from '@providers/accessibility/__mocks__/accessibility-service.mock';
import { TestOutcomeComponent } from '../test-outcome';
import { TestSlotComponentsModule } from '../../test-slot-components.module';
import { RouterMock } from '@mocks/angular-mocks/router-mock';

describe('TestOutcomeComponent', () => {
  let fixture: ComponentFixture<TestOutcomeComponent>;
  let component: TestOutcomeComponent;
  let routeByCategory: RouteByCategoryProvider;
  let router: Router;
  let store$: Store<StoreModel>;

  const testSlotDetail: SlotDetail = {
    duration: 57,
    slotId: 123,
    start: new DateTime().format('YYYY-MM-DDTHH:mm:ss'),
  };

  const journal: JournalModel = {
    isLoading: false,
    lastRefreshed: new Date(),
    slots: {},
    selectedDate: 'dummy',
    examiner: {
      staffNumber: '123',
      individualId: 456,
    },
    completedTests: [],
  };

  const categoryPages = [
    {
      category: TestCategory.B,
      pageConstant: CAT_B,
    },
    {
      category: TestCategory.C,
      pageConstant: CAT_C,
    },
    {
      category: TestCategory.CE,
      pageConstant: CAT_C,
    },
    {
      category: TestCategory.C1,
      pageConstant: CAT_C,
    },
    {
      category: TestCategory.C1E,
      pageConstant: CAT_C,
    },
    {
      category: TestCategory.D,
      pageConstant: CAT_D,
    },
    {
      category: TestCategory.DE,
      pageConstant: CAT_D,
    },
    {
      category: TestCategory.D1,
      pageConstant: CAT_D,
    },
    {
      category: TestCategory.D1E,
      pageConstant: CAT_D,
    },
    {
      category: TestCategory.EUAM1,
      pageConstant: CAT_A_MOD1,
    },
    {
      category: TestCategory.EUA2M1,
      pageConstant: CAT_A_MOD1,
    },
    {
      category: TestCategory.EUAM1,
      pageConstant: CAT_A_MOD1,
    },
    {
      category: TestCategory.EUAMM1,
      pageConstant: CAT_A_MOD1,
    },
    {
      category: TestCategory.EUAM2,
      pageConstant: CAT_A_MOD2,
    },
    {
      category: TestCategory.EUA2M2,
      pageConstant: CAT_A_MOD2,
    },
    {
      category: TestCategory.EUAM2,
      pageConstant: CAT_A_MOD2,
    },
    {
      category: TestCategory.EUAMM2,
      pageConstant: CAT_A_MOD2,
    },
    {
      category: TestCategory.EUA1M1,
      pageConstant: CAT_A_MOD1,
    },
    {
      category: TestCategory.EUA1M2,
      pageConstant: CAT_A_MOD2,
    },
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestOutcomeComponent],
      imports: [
        StoreModule.forRoot({
          tests: () => ({
            currentTest: {},
            testStatus: {},
            startedTests: {
              1234: {
                category: 'B',
                activityCode: ActivityCodes.BAD_LIGHT,
                journalData: {},
                rekey: false,
              },
            },
          }),
          journal: () => (journal),
          rekeySearch: () => ({ bookedTestSlot: {} }),
        }),
        TestSlotComponentsModule,
      ],
      providers: [
        {
          provide: LogHelper,
          useClass: LogHelperMock,
        },
        {
          provide: Router,
          useClass: RouterMock,
        },
        {
          provide: RouteByCategoryProvider,
          useClass: RouteByCategoryProviderMock,
        },
        {
          provide: AppComponent,
          useClass: MockAppComponent,
        },
        {
          provide: AccessibilityService,
          useClass: AccessibilityServiceMock,
        },
        CategoryWhitelistProvider,
      ],
    });

    fixture = TestBed.createComponent(TestOutcomeComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    routeByCategory = TestBed.inject(RouteByCategoryProvider);
    router = TestBed.inject(Router);
    spyOn(store$, 'dispatch');
    spyOn(routeByCategory, 'navigateToPage');
    spyOn(router, 'navigate');
  }));

  describe('Class', () => {
    describe('startTest', () => {
      it('should dispatch a start test action with the slot', () => {
        component.slotDetail = testSlotDetail;
        component.category = TestCategory.B;
        component.startTest();

        expect(store$.dispatch)
          .toHaveBeenCalledWith(StartTest(component.slotDetail.slotId, component.category));
      });
      it('should dispatch a start test action with the slot', () => {
        component.slotDetail = testSlotDetail;
        component.category = TestCategory.C;
        component.startTest();

        expect(store$.dispatch)
          .toHaveBeenCalledWith(StartTest(component.slotDetail.slotId, component.category));
      });
    });
    describe('earlyStart', () => {
      it('should create and present the early start modal', () => {
        component.slotDetail = testSlotDetail;
        component.slotDetail.start = new DateTime().add(8, Duration.MINUTE)
          .format('YYYY-MM-DDTHH:mm:ss');
        component.testStatus = TestStatus.Booked;
        spyOn(component, 'displayCheckStartModal');
        fixture.detectChanges();
        const startButton = fixture.debugElement.query(By.css('.mes-primary-button'));
        startButton.triggerEventHandler('click', null);
        expect(component.displayCheckStartModal)
          .toHaveBeenCalled();
      });
      it('should not create and present the early start modal', () => {
        component.slotDetail = testSlotDetail;
        component.slotDetail.start = new DateTime().add(2, Duration.MINUTE)
          .format('YYYY-MM-DDTHH:mm:ss');
        component.testStatus = TestStatus.Booked;
        spyOn(component, 'displayCheckStartModal');
        fixture.detectChanges();
        const startButton = fixture.debugElement.query(By.css('.mes-primary-button'));
        startButton.triggerEventHandler('click', null);
        expect(component.displayCheckStartModal)
          .not
          .toHaveBeenCalled();
      });
    });

    describe('writeUpTest', () => {
      beforeEach(() => {
        component.slotDetail = testSlotDetail;
        component.hasNavigatedFromUnsubmitted = false;
      });
      it('should dispatch the ContinueUnuploadedTest when hasNavigatedFromUnsubmitted is set to true', async () => {
        component.hasNavigatedFromUnsubmitted = true;
        await component.writeUpTest();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(ContinueUnuploadedTest(TestStatus.WriteUp));
      });
      categoryPages.forEach((cat) => {
        it(`should dispatch an ActivateTest action and navigate to the Office Cat ${cat.category} page`, async () => {
          component.category = cat.category;
          await component.writeUpTest();
          expect(store$.dispatch)
            .toHaveBeenCalledWith(ActivateTest(component.slotDetail.slotId, cat.category));
          expect(routeByCategory.navigateToPage)
            .toHaveBeenCalledWith(
              TestFlowPageNames.OFFICE_PAGE, component.category, { state: { hasNavigatedFromUnsubmitted: false } },
            );
        });
      });
    });

    describe('resumeTest', () => {
      beforeEach(() => {
        component.slotDetail = testSlotDetail;
        component.hasNavigatedFromUnsubmitted = false;
      });
      it('should dispatch the ContinueUnuploadedTest when hasNavigatedFromUnsubmitted is set to true', async () => {
        component.hasNavigatedFromUnsubmitted = true;
        await component.resumeTest();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(ContinueUnuploadedTest('Resume'));
      });
      categoryPages.forEach((cat) => {
        it(`Cat ${cat.category} should dispatch an ActivateTest action and navigate to the Waiting Room page`, () => {
          component.testStatus = TestStatus.Started;
          component.category = cat.category;
          component.resumeTest();
          expect(store$.dispatch)
            .toHaveBeenCalledWith(ActivateTest(component.slotDetail.slotId, cat.category));
          expect(router.navigate)
            .toHaveBeenCalledWith([TestFlowPageNames.WAITING_ROOM_PAGE]);
        });
        it(`Cat ${cat.category} should dispatch an ActivateTest action and
         navigate to the Pass Finalisation page`, () => {
          component.testStatus = TestStatus.Decided;
          component.activityCode = ActivityCodes.PASS;
          component.category = cat.category;
          component.resumeTest();
          expect(store$.dispatch)
            .toHaveBeenCalledWith(ActivateTest(component.slotDetail.slotId, cat.category));
          expect(routeByCategory.navigateToPage)
            .toHaveBeenCalledWith(
              TestFlowPageNames.PASS_FINALISATION_PAGE, component.category,
            );
        });
        it(`Cat ${cat.category} should dispatch an ActivateTest action
        and navigate to the Non Pass Finalisation page`, () => {
          component.testStatus = TestStatus.Decided;
          component.activityCode = ActivityCodes.FAIL;
          component.category = cat.category;
          component.resumeTest();
          expect(store$.dispatch)
            .toHaveBeenCalledWith(ActivateTest(component.slotDetail.slotId, cat.category));
          expect(routeByCategory.navigateToPage)
            .toHaveBeenCalledWith(
              TestFlowPageNames.NON_PASS_FINALISATION_PAGE,
            );
        });
      });
    });

    describe('showRekeyButton', () => {
      it('should return false for a completed test', () => {
        component.slotDetail = testSlotDetail;
        component.testStatus = TestStatus.Completed;

        component.showRekeyButton();

        expect(component.showRekeyButton())
          .toEqual(false);
      });
      it('should return true for a booked test on the rekey search page', () => {
        component.slotDetail = testSlotDetail;
        component.testStatus = TestStatus.Booked;
        component.isTestSlotOnRekeySearch = true;

        component.showRekeyButton();

        expect(component.showRekeyButton())
          .toEqual(true);
      });
      it('should return false for a completed test on the rekey search page', () => {
        component.slotDetail = testSlotDetail;
        component.testStatus = TestStatus.Completed;
        component.isTestSlotOnRekeySearch = true;

        component.showRekeyButton();

        expect(component.showRekeyButton())
          .toEqual(false);
      });
      it('should return true for a test that was started as a rekey and the date is in the past', () => {
        component.slotDetail = testSlotDetail;
        component.slotDetail.start = new DateTime().subtract(1, Duration.DAY)
          .format('YYYY-MM-DDTHH:mm:ss');
        component.testStatus = TestStatus.Started;
        component.isRekey = true;

        component.showRekeyButton();

        expect(component.showRekeyButton())
          .toEqual(true);
      });
      it('should return false for test that was started as a rekey and the date is today', () => {
        component.slotDetail = testSlotDetail;
        component.slotDetail.start = new DateTime().format('YYYY-MM-DDTHH:mm:ss');
        component.testStatus = TestStatus.Started;
        component.isRekey = true;

        component.showRekeyButton();

        expect(component.showRekeyButton())
          .toEqual(false);
      });
      it('should return true for a new test if date is in past', () => {
        component.slotDetail = testSlotDetail;
        component.slotDetail.start = new DateTime().subtract(1, Duration.DAY)
          .format('YYYY-MM-DDTHH:mm:ss');
        component.testStatus = null;

        component.showRekeyButton();

        expect(component.showRekeyButton())
          .toEqual(true);
      });
      it('should return true for a booked test if date is in past', () => {
        component.slotDetail = testSlotDetail;
        component.slotDetail.start = new DateTime().subtract(1, Duration.DAY)
          .format('YYYY-MM-DDTHH:mm:ss');
        component.testStatus = TestStatus.Booked;

        component.showRekeyButton();

        expect(component.showRekeyButton())
          .toEqual(true);
      });
      it('should return false for a resumed test if date is in past', () => {
        component.slotDetail = testSlotDetail;
        component.slotDetail.start = new DateTime().subtract(1, Duration.DAY)
          .format('YYYY-MM-DDTHH:mm:ss');
        component.testStatus = TestStatus.Started;

        component.showRekeyButton();

        expect(component.showRekeyButton())
          .toEqual(false);
      });
      it('should return true for a booked test if date is in the past', () => {
        component.slotDetail = testSlotDetail;
        component.slotDetail.start = new DateTime().subtract(1, Duration.DAY)
          .format('YYYY-MM-DDTHH:mm:ss');
        component.testStatus = TestStatus.Booked;

        component.showRekeyButton();

        expect(component.showRekeyButton())
          .toEqual(true);
      });
      it('should return false for a booked test if date is today', () => {
        component.slotDetail = testSlotDetail;
        component.slotDetail.start = new DateTime().format('YYYY-MM-DDTHH:mm:ss');
        component.testStatus = TestStatus.Booked;

        component.showRekeyButton();

        expect(component.showRekeyButton())
          .toEqual(false);
      });
      it('should return false for a resumed test if date is today', () => {
        component.slotDetail = testSlotDetail;
        component.slotDetail.start = new DateTime().format('YYYY-MM-DDTHH:mm:ss');
        component.testStatus = TestStatus.Started;

        component.showRekeyButton();

        expect(component.showRekeyButton())
          .toEqual(false);
      });
    });
  });

  describe('DOM', () => {
    describe('show start test button', () => {
      it('should show the start test button when the test status is Booked', () => {
        spyOn(component, 'showRekeyButton')
          .and
          .returnValue(false);

        component.slotDetail = testSlotDetail;
        component.testStatus = TestStatus.Booked;
        component.isDelegatedTest = false;
        fixture.detectChanges();
        const startButton = fixture.debugElement.queryAll(By.css('.mes-primary-button'));
        expect(startButton.length)
          .toBe(1);
      });

      it('should not show the start test button when the test has a status other than booked', () => {
        component.slotDetail = testSlotDetail;
        component.testStatus = TestStatus.Started;
        fixture.detectChanges();
        const startButton = fixture.debugElement.queryAll(By.css('.mes-primary-button'));
        expect(startButton.length)
          .toBe(0);
      });
    });

    describe('start a test', () => {
      it('should call the startTest method when `Start test` is clicked', () => {
        spyOn(component, 'showRekeyButton')
          .and
          .returnValue(false);

        component.slotDetail = testSlotDetail;
        component.testStatus = TestStatus.Booked;
        component.isDelegatedTest = false;
        fixture.detectChanges();
        spyOn(component, 'startTest');

        const startButton = fixture.debugElement.query(By.css('.mes-primary-button'));
        startButton?.triggerEventHandler('click', null);

        expect(component.startTest)
          .toHaveBeenCalled();
      });
    });

    describe('rekey a test', () => {
      beforeEach(() => {
        component.slotDetail = testSlotDetail;
        component.hasNavigatedFromUnsubmitted = false;
      });
      it('should dispatch the ContinueUnuploadedTest when hasNavigatedFromUnsubmitted is set to true', async () => {
        component.hasNavigatedFromUnsubmitted = true;
        await component.rekeyTest();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(ContinueUnuploadedTest('Rekey'));
      });
      it('should call the rekeyTest method when `Rekey` is clicked', () => {
        component.slotDetail = testSlotDetail;
        component.category = TestCategory.B;
        component.testStatus = TestStatus.Booked;
        component.slotDetail.start = new DateTime().subtract(1, Duration.DAY)
          .format('YYYY-MM-DDTHH:mm:ss');
        fixture.detectChanges();
        spyOn(component, 'rekeyTest');
        const rekeyButton = fixture.debugElement.query(By.css('.mes-rekey-button'));
        rekeyButton.triggerEventHandler('click', null);
        expect(component.rekeyTest)
          .toHaveBeenCalled();
      });
      categoryPages.forEach((cat) => {
        it(`should navigate to cat ${cat.category} waiting room page when "Rekey" is clicked`, () => {
          component.slotDetail = testSlotDetail;
          component.category = cat.category;
          component.rekeyTest();
          expect(router.navigate)
            .toHaveBeenCalledWith([TestFlowPageNames.WAITING_ROOM_PAGE]);
        });
      });
    });

    describe('rekeyDelegatedTest', () => {
      it('should call the rekeyDelegatedTest method when `Rekey` is clicked', () => {
        component.slotDetail = testSlotDetail;
        component.category = TestCategory.BE;
        spyOn(component, 'showDelegatedExaminerRekeyButton')
          .and
          .returnValue(true);
        spyOn(component, 'rekeyDelegatedTest');
        fixture.detectChanges();
        const rekeyDelegatedButton = fixture.debugElement.query(By.css('.mes-rekey-button'));
        rekeyDelegatedButton.triggerEventHandler('click', null);
        expect(component.rekeyDelegatedTest)
          .toHaveBeenCalled();
      });
    });

    describe('debrief a test', () => {
      it('should call the resumeTest method when `Resume` is clicked', () => {
        spyOn(component, 'showResumeButton')
          .and
          .returnValue(true);
        component.slotDetail = testSlotDetail;
        component.testStatus = TestStatus.Decided;
        fixture.detectChanges();
        spyOn(component, 'resumeTest');

        const debriefButton = fixture.debugElement.query(By.css('.mes-warning-button'));
        debriefButton.triggerEventHandler('click', null);

        expect(component.resumeTest)
          .toHaveBeenCalled();
      });
    });

    describe('write up a test', () => {
      it('should call the writeUpTest method when `Write-up` is clicked', () => {
        component.testStatus = TestStatus.WriteUp;
        component.slotDetail = testSlotDetail;
        fixture.detectChanges();
        spyOn(component, 'writeUpTest');

        const writeUpButton = fixture.debugElement.query(By.css('.mes-secondary-button'));
        writeUpButton.triggerEventHandler('click', null);

        expect(component.writeUpTest)
          .toHaveBeenCalled();
      });
    });

    describe('resume a test', () => {
      it('should call the resumeTest method when `Resume` is clicked', () => {
        spyOn(component, 'showResumeButton')
          .and
          .returnValue(true);
        component.slotDetail = testSlotDetail;
        component.testStatus = TestStatus.Started;
        fixture.detectChanges();
        spyOn(component, 'resumeTest');

        const resumeButton = fixture.debugElement.query(By.css('.mes-warning-button'));
        resumeButton.triggerEventHandler('click', null);

        expect(component.resumeTest)
          .toHaveBeenCalled();
      });
    });

    describe('rekey button', () => {
      it('should show rekey button', () => {
        spyOn(component, 'showRekeyButton')
          .and
          .returnValue(true);
        fixture.detectChanges();

        const rekeyButton = fixture.debugElement.query(By.css('.mes-rekey-button'));

        expect(rekeyButton)
          .not
          .toBeNull();
      });
      it('should hide rekey button', () => {
        spyOn(component, 'showRekeyButton')
          .and
          .returnValue(false);
        fixture.detectChanges();

        const rekeyButton = fixture.debugElement.query(By.css('.mes-rekey-button'));

        expect(rekeyButton)
          .toBeNull();
      });
    });

    describe('rekey modal', () => {
      describe('showOutcome (DOM)', () => {
        it('should display the activity code if one is available', () => {
          component.slotDetail = testSlotDetail;
          component.testStatus = TestStatus.Submitted;
          fixture.detectChanges();
          const outcomeCode = fixture.debugElement.query(By.css('.outcome'));
          expect(outcomeCode)
            .not
            .toBeNull();
        });
        it('should hide the activity code if none available', () => {
          component.slotDetail = testSlotDetail;
          component.slotDetail.slotId = null;
          fixture.detectChanges();
          const outcomeCode = fixture.debugElement.query(By.css('.outcome'));
          expect(outcomeCode)
            .toBeNull();
        });
      });

      describe('show force detail check modal', () => {
        it('should display the force detail check modal', () => {
          spyOn(component, 'showRekeyButton')
            .and
            .returnValue(false);

          component.specialRequirements = true;
          component.slotDetail = testSlotDetail;
          component.testStatus = TestStatus.Booked;
          component.hasSeenCandidateDetails = false;
          spyOn(component, 'displayForceCheckModal');
          fixture.detectChanges();

          const startButton = fixture.debugElement.query(By.css('.mes-primary-button'));
          startButton?.triggerEventHandler('click', null);

          expect(component.displayForceCheckModal)
            .toHaveBeenCalled();
        });
      });

      describe('candidate details seen, force detail check modal should not be seen', () => {
        it('should not display the force detail check modal', () => {
          spyOn(component, 'showRekeyButton')
            .and
            .returnValue(false);

          component.specialRequirements = true;
          component.slotDetail = testSlotDetail;
          component.testStatus = TestStatus.Booked;
          component.slotDetail.slotId = 123456;
          component.hasSeenCandidateDetails = true;
          spyOn(component, 'displayForceCheckModal');
          fixture.detectChanges();

          const startButton = fixture.debugElement.query(By.css('.mes-primary-button'));
          startButton?.triggerEventHandler('click', null);

          expect(component.displayForceCheckModal)
            .toHaveBeenCalledTimes(0);
        });
      });
    });
  });

  describe('ionViewDidLeave', () => {
    it('should unsubscribe from the subscription if there is one', () => {
      component.subscription = new Subscription();
      spyOn(component.subscription, 'unsubscribe');
      component.ionViewDidLeave();
      expect(component.subscription.unsubscribe)
        .toHaveBeenCalled();
    });
  });
});

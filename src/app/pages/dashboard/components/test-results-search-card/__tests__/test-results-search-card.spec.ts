import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from 'ionic-angular';
import { TestResultsSearchCardComponent } from '../test-results-search-card';
import { NavControllerMock } from 'ionic-mocks';
import { TEST_RESULTS_SEARCH_PAGE } from '../../../../page-names.constants';
import { configureTestSuite } from 'ng-bullet';

describe('TestResultsSearchCard ', () => {
  let component: TestResultsSearchCardComponent;
  let fixture: ComponentFixture<TestResultsSearchCardComponent>;
  let navContoller: NavController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [TestResultsSearchCardComponent],
      imports: [IonicModule.forRoot(TestResultsSearchCardComponent)],
      providers: [
        { provide: NavController, useFactory: () => NavControllerMock.instance() },
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TestResultsSearchCardComponent);
    component = fixture.componentInstance;
    navContoller = TestBed.get(NavController);
  }));

  describe('Class', () => {
    describe('navigateToFakeJournal', () => {
      it('should trigger navigation to Fake Journal', () => {
        component.navigateToTestResultsSearch();

        expect(navContoller.push).toHaveBeenCalledWith(TEST_RESULTS_SEARCH_PAGE);
      });
    });
  });

  describe('DOM', () => {

  });
});

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { configureTestSuite } from 'ng-bullet';
import { TestResultsSearchCardComponent } from '../test-results-search-card';
import { TEST_RESULTS_SEARCH_PAGE } from '../../../../page-names.constants';

describe('TestResultsSearchCard ', () => {
  let component: TestResultsSearchCardComponent;
  let fixture: ComponentFixture<TestResultsSearchCardComponent>;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [TestResultsSearchCardComponent],
      providers: [
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(TestResultsSearchCardComponent);
    component = fixture.componentInstance;
  }));

  // TODO: tests will be reinstated when test results search is implemented
  xdescribe('Class', () => {
    describe('navigateToFakeJournal', () => {
      it('should trigger navigation to Fake Journal', () => {
        component.navigateToTestResultsSearch();

        expect(router.navigate).toHaveBeenCalledWith([TEST_RESULTS_SEARCH_PAGE]);
      });
    });
  });
});

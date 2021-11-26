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

  // @TODO: MES-7105 tests will be reinstated when test results search is implemented UPDATE TEST DESCRIPTION
  xdescribe('Class', () => {
    describe('navigateToTestResultsSearch', () => {
      it('should trigger navigation to test result search page', () => {
        component.navigateToTestResultsSearch();

        expect(router.navigate).toHaveBeenCalledWith([TEST_RESULTS_SEARCH_PAGE]);
      });
    });
  });
});

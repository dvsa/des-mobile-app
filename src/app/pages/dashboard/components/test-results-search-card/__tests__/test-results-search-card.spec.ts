import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TEST_RESULTS_SEARCH_PAGE } from '@pages/page-names.constants';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { IonicModule } from '@ionic/angular';
import { TestResultsSearchCardComponent } from '../test-results-search-card';

fdescribe('TestResultsSearchCard ', () => {
  let component: TestResultsSearchCardComponent;
  let fixture: ComponentFixture<TestResultsSearchCardComponent>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestResultsSearchCardComponent],
      imports: [IonicModule],
      providers: [
        { provide: Router, useClass: RouterMock },
      ],
    });

    fixture = TestBed.createComponent(TestResultsSearchCardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  }));

  describe('Class', () => {
    describe('navigateToTestResultsSearch', () => {
      it('should trigger navigation to test result search page', async () => {
        await component.navigateToTestResultsSearch();
        expect(router.navigate).toHaveBeenCalledWith([TEST_RESULTS_SEARCH_PAGE]);
      });
    });
  });
});

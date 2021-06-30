import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { configureTestSuite } from 'ng-bullet';
import { FAKE_JOURNAL_PAGE } from '@pages/page-names.constants';
import { PracticeEndToEndCardComponent } from '../practice-end-to-end-card';

describe('PracticeEndToEndCard ', () => {
  let component: PracticeEndToEndCardComponent;
  let fixture: ComponentFixture<PracticeEndToEndCardComponent>;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PracticeEndToEndCardComponent],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PracticeEndToEndCardComponent);
    component = fixture.componentInstance;
  }));

  // TODO: tests will be reinstated when practice end-to-end mode is implemented
  xdescribe('Class', () => {
    describe('navigateToFakeJournal', () => {
      it('should trigger navigation to Fake Journal', () => {
        component.navigateToFakeJournal();

        expect(router.navigate).toHaveBeenCalledWith([FAKE_JOURNAL_PAGE]);
      });
    });
  });

});

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { configureTestSuite } from 'ng-bullet';
import { FAKE_JOURNAL_PAGE } from '@pages/page-names.constants';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { PracticeEndToEndCardComponent } from '../practice-end-to-end-card';

describe('PracticeEndToEndCard ', () => {
  let component: PracticeEndToEndCardComponent;
  let fixture: ComponentFixture<PracticeEndToEndCardComponent>;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PracticeEndToEndCardComponent],
      providers: [
        { provide: Router, useClass: RouterMock },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(PracticeEndToEndCardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  }));

  describe('Class', () => {
    describe('navigateToFakeJournal', () => {
      it('should trigger navigation to Fake Journal', () => {
        spyOn(router, 'navigate');
        component.navigateToFakeJournal();
        expect(router.navigate).toHaveBeenCalledWith([FAKE_JOURNAL_PAGE]);
      });
    });
  });

});

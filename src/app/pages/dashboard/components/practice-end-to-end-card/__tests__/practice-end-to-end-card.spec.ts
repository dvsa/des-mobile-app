import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { configureTestSuite } from 'ng-bullet';
import { PracticeEndToEndCardComponent } from '../practice-end-to-end-card';
import { FAKE_JOURNAL_PAGE } from '../../../../page-names.constants';

describe('PracticeEndToEndCard ', () => {
  let component: PracticeEndToEndCardComponent;
  let fixture: ComponentFixture<PracticeEndToEndCardComponent>;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PracticeEndToEndCardComponent],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PracticeEndToEndCardComponent);
    component = fixture.componentInstance;
  }));

  xdescribe('Class', () => {
    describe('navigateToFakeJournal', () => {
      it('should trigger navigation to Fake Journal', () => {
        component.navigateToFakeJournal();

        expect(router.navigate).toHaveBeenCalledWith([FAKE_JOURNAL_PAGE]);
      });
    });
  });

});

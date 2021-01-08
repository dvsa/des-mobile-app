import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { GoToJournalCardComponent } from '../go-to-journal-card';
import { JOURNAL_PAGE } from '../../../../page-names.constants';

describe('GoToJournalCard ', () => {
  let component: GoToJournalCardComponent;
  let fixture: ComponentFixture<GoToJournalCardComponent>;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [GoToJournalCardComponent],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GoToJournalCardComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('navigateToJournal', () => {
      it('should trigger navigation to Journal', () => {
        component.navigateToJournal();

        expect(router.navigate).toHaveBeenCalledWith([JOURNAL_PAGE]);
      });
    });
  });
});

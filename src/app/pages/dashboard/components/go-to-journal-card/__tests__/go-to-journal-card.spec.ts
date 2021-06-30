import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { GoToJournalCardComponent } from '../go-to-journal-card';
import { JOURNAL_PAGE } from '../../../../page-names.constants';
import { JournalPage } from '../../../../journal/journal.page';

describe('GoToJournalCard ', () => {
  let component: GoToJournalCardComponent;
  let fixture: ComponentFixture<GoToJournalCardComponent>;
  let routerSpy;

  configureTestSuite(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [GoToJournalCardComponent],
      imports: [
        RouterTestingModule.withRoutes(
          [
            { path: 'journal', component: JournalPage },
          ],
        ),
      ],
      providers: [{ provide: Router, useValue: routerSpy }],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(GoToJournalCardComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('navigateToJournal', () => {
      it('should trigger navigation to Journal', () => {
        component.navigateToJournal();

        expect(routerSpy.navigate).toHaveBeenCalledWith([JOURNAL_PAGE]);
      });
    });
  });
});

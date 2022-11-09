import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { JOURNAL_PAGE } from '@pages/page-names.constants';
import { JournalPage } from '@pages/journal/journal.page';
import { IonicModule } from '@ionic/angular';
import { GoToJournalCardComponent } from '../go-to-journal-card';

fdescribe('GoToJournalCard', () => {
  let component: GoToJournalCardComponent;
  let fixture: ComponentFixture<GoToJournalCardComponent>;
  let routerSpy;

  beforeEach(waitForAsync(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [GoToJournalCardComponent],
      imports: [
        IonicModule,
        RouterTestingModule.withRoutes(
          [
            { path: 'journal', component: JournalPage },
          ],
        ),
      ],
      providers: [{ provide: Router, useValue: routerSpy }],
    });

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

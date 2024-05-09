import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { JOURNAL_PAGE } from '@pages/page-names.constants';
import { JournalPage } from '@pages/journal/journal.page';
import { IonicModule } from '@ionic/angular';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { GoToJournalCardComponent } from '../go-to-journal-card';

describe('GoToJournalCard', () => {
  let component: GoToJournalCardComponent;
  let fixture: ComponentFixture<GoToJournalCardComponent>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GoToJournalCardComponent],
      imports: [
        IonicModule,
        RouterTestingModule.withRoutes(
          [
            {
              path: 'journal',
              component: JournalPage,
            },
          ],
        ),
      ],
      providers: [
        {
          provide: Router,
          useClass: RouterMock,
        },
      ],
    });

    fixture = TestBed.createComponent(GoToJournalCardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  }));

  describe('Class', () => {
    describe('navigateToJournal', () => {
      it('should trigger navigation to JOURNAL_PAGE', async () => {
        await component.navigateToJournal();
        expect(router.navigate)
          .toHaveBeenCalledWith([JOURNAL_PAGE]);
      });
    });
  });
});

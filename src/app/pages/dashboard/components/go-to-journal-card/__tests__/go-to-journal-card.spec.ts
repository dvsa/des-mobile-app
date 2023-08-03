import { RouterTestingModule } from '@angular/router/testing';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { JournalPage } from '@pages/journal/journal.page';
import { IonicModule } from '@ionic/angular';
import { GoToJournalCardComponent } from '../go-to-journal-card';

describe('GoToJournalCard', () => {
  let component: GoToJournalCardComponent;
  let fixture: ComponentFixture<GoToJournalCardComponent>;

  beforeEach(waitForAsync(() => {
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
    });

    fixture = TestBed.createComponent(GoToJournalCardComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('navigateToJournal', () => {
      it('should emit navigateClicked', () => {
        spyOn(component.navigateClicked, 'emit');
        component.navigateToJournal();
        expect(component.navigateClicked.emit).toHaveBeenCalledWith('JournalPage');
      });
    });
  });
});

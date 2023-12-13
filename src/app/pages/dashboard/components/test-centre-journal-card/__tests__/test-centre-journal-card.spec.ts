import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { TEST_CENTRE_JOURNAL_PAGE } from '@pages/page-names.constants';
import { TestCentreJournalCardComponent } from '../test-centre-journal-card';
import { RouterMock } from '@mocks/angular-mocks/router-mock';

describe('TestCentreJournalCard', () => {
  let component: TestCentreJournalCardComponent;
  let fixture: ComponentFixture<TestCentreJournalCardComponent>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestCentreJournalCardComponent],
      imports: [
        IonicModule,
        CommonModule,
      ],
      providers: [
        {
          provide: Router,
          useClass: RouterMock,
        },
      ],
    });

    fixture = TestBed.createComponent(TestCentreJournalCardComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });

  describe('navigateToTestCentreJournal', () => {
    it('should call router.navigate with correct info', async () => {
      await component.navigateToTestCentreJournal();
      expect(router.navigate)
        .toHaveBeenCalledWith([TEST_CENTRE_JOURNAL_PAGE]);
    });
  });
});

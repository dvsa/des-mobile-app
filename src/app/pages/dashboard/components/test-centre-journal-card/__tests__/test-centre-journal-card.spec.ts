import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { configureTestSuite } from 'ng-bullet';
import { TestCentreJournalCardComponent } from '../test-centre-journal-card';
import { TEST_CENTRE_JOURNAL_PAGE } from '../../../../page-names.constants';

describe('TestCentreJournalCard', () => {
  let component: TestCentreJournalCardComponent;
  let fixture: ComponentFixture<TestCentreJournalCardComponent>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [TestCentreJournalCardComponent],
      imports: [
        IonicModule,
        CommonModule,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(TestCentreJournalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navigateToTestCentreJournal', () => {
    it('should call router.navigate with correct info', () => {
      component.navigateToTestCentreJournal();
      expect(routerSpy.navigate).toHaveBeenCalledWith([TEST_CENTRE_JOURNAL_PAGE]);
    });
  });
});

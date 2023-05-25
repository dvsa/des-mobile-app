import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { TEST_CENTRE_JOURNAL_PAGE } from '@pages/page-names.constants';
import { MockComponent } from 'ng-mocks';
import { HeaderComponent } from '@components/common/header-component/header.component';
import { TestCentreJournalCardComponent } from '../test-centre-journal-card';

describe('TestCentreJournalCard', () => {
  let component: TestCentreJournalCardComponent;
  let fixture: ComponentFixture<TestCentreJournalCardComponent>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestCentreJournalCardComponent,
        MockComponent(HeaderComponent),
      ],
      imports: [
        IonicModule,
        CommonModule,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
      ],
    });

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

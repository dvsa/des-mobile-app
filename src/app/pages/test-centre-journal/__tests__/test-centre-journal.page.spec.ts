import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { configureTestSuite } from 'ng-bullet';
import { TestCentreJournalPage } from '../test-centre-journal.page';
import { AuthenticationProvider } from '../../../providers/authentication/authentication';
import { AuthenticationProviderMock } from '../../../providers/authentication/__mocks__/authentication.mock';

describe('TestCenterJournalPage', () => {
  let component: TestCentreJournalPage;
  let fixture: ComponentFixture<TestCentreJournalPage>;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [TestCentreJournalPage],
      imports: [
        IonicModule,
        CommonModule,
        RouterTestingModule.withRoutes(
          [
            { path: '', component: TestCentreJournalPage },
          ],
        ),
      ],
      providers: [
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
      ],
    });
  });
  beforeEach(async(() => {
    fixture = TestBed.createComponent(TestCentreJournalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

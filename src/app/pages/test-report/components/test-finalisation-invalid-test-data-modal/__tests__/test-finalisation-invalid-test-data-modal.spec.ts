import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TestFinalisationInvalidTestDataModal } from '@pages/test-report/components/test-finalisation-invalid-test-data-modal/test-finalisation-invalid-test-data-modal';

describe('TestFinalisationInvalidTestDataModal', () => {
  let fixture: ComponentFixture<TestFinalisationInvalidTestDataModal>;
  let component: TestFinalisationInvalidTestDataModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestFinalisationInvalidTestDataModal],
      imports: [IonicModule],
    });

    fixture = TestBed.createComponent(TestFinalisationInvalidTestDataModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('constructor', () => {
    it('should be created', () => {
      expect(component).toBeTruthy();
    });
  });
});

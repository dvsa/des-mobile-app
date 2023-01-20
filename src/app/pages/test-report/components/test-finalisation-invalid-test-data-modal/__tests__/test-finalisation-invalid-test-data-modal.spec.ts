import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavParams } from '@ionic/angular';
import { TestFinalisationInvalidTestDataModal } from
  '@pages/test-report/components/test-finalisation-invalid-test-data-modal/test-finalisation-invalid-test-data-modal';

describe('TestFinalisationInvalidTestDataModal', () => {
  let fixture: ComponentFixture<TestFinalisationInvalidTestDataModal>;
  let component: TestFinalisationInvalidTestDataModal;

  const mockNavParams = {
    get: (param: string) => {
      const data = {
        onCancel: () => { return 1; },
        onReturnToTestReport: () => { return 2; },
        message: 'test3',
      };
      return data[param];
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestFinalisationInvalidTestDataModal],
      imports: [
        IonicModule,
      ],
      providers: [
        { provide: NavParams, useValue: mockNavParams },
      ],
    });

    fixture = TestBed.createComponent(TestFinalisationInvalidTestDataModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('constructor', () => {
    it('should be created', () => {
      expect(component).toBeTruthy();
    });
  });
});

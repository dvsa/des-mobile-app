import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavParams } from '@ionic/angular';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { TestFinalisationInvalidTestDataModal } from
  '@pages/test-report/components/test-finalisation-invalid-test-data-modal/test-finalisation-invalid-test-data-modal';
import { NavParamsMock } from '@mocks/angular-mocks/nav-params.mock';

describe('TestFinalisationInvalidTestDataModal', () => {
  let fixture: ComponentFixture<TestFinalisationInvalidTestDataModal>;
  let component: TestFinalisationInvalidTestDataModal;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule,
      ],
      providers: [
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProvider },
        { provide: NavParams, useClass: NavParamsMock },
      ],
    });

    fixture = TestBed.createComponent(TestFinalisationInvalidTestDataModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('constructor', () => {
    it('should fill variables with correct data', () => {
      component.navParams.data = {
        onCancel: () => { return 1; },
        onReturnToTestReport: () => { return 2; },
        message: 'test3',
      };

      expect(component.onCancel).toBe(() => { return 1; });
      expect(component.onReturnToTestReport).toBe(() => { return 2; });
      expect(component.message).toBe('test3');
    });
  });
});

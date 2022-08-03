import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TestOutcome } from '@store/tests/tests.constants';
import { configureTestSuite } from 'ng-bullet';
import { ViewTestHeaderComponent } from '../view-test-header';

describe('ViewTestHeaderComponent', () => {
  let fixture: ComponentFixture<ViewTestHeaderComponent>;
  let component: ViewTestHeaderComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ViewTestHeaderComponent,
      ],
      imports: [
        IonicModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ViewTestHeaderComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('isPassed', () => {
      it('should return true for activity code 1', () => {
        component.data = {
          grade: '',
          activityCode: '1',
          candidateDriverNumber: '',
          candidateName: '',
          testOutcome: TestOutcome.Passed,
        };
        expect(component.isPassed()).toBe(true);
      });
      it('should return false for an activity code that is not 1', () => {
        component.data = {
          grade: '',
          activityCode: '5',
          candidateDriverNumber: '',
          candidateName: '',
          testOutcome: TestOutcome.Passed,
        };
        expect(component.isPassed()).toBe(false);
      });
    });
  });
});

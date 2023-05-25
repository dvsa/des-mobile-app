import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TestOutcome } from '@store/tests/tests.constants';
import { ViewTestHeaderModel } from '@pages/view-test-result/components/view-test-header/view-test-header.model';
import { MockComponent } from 'ng-mocks';
import { HeaderComponent } from '@components/common/header-component/header.component';
import { ViewTestHeaderComponent } from '../view-test-header';

describe('ViewTestHeaderComponent', () => {
  let fixture: ComponentFixture<ViewTestHeaderComponent>;
  let component: ViewTestHeaderComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ViewTestHeaderComponent,
        MockComponent(HeaderComponent),
      ],
      imports: [
        IonicModule,
      ],
    });

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
    describe('getActivityCodeDescription', () => {
      it('should return correct string value', () => {
        component.data = { activityCode: '2' } as ViewTestHeaderModel;
        expect(component.getActivityCodeDescription()).toEqual('Fail');
      });
    });
  });
});

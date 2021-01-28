import { async, ComponentFixture, TestBed } from '@angular/core/testing'; // ComponentFixture
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '../../../../app/app.module';
import { SubmissionStatusComponent } from '../submission-status';
import { TestStatus } from '../../../../store/tests/test-status/test-status.model';

xdescribe('PracticeTestModal', () => {
  let fixture: ComponentFixture<SubmissionStatusComponent>;
  let component: SubmissionStatusComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubmissionStatusComponent,
      ],
      imports: [
        AppModule,
        IonicModule,
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SubmissionStatusComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('showBanner', () => {
      it('should show banner if test status is completed', () => {
        component.testStatus = TestStatus.Completed;
        expect(component.showBanner()).toEqual(true);
      });
      it('should not show banner if test status is booked', () => {
        component.testStatus = TestStatus.Booked;
        expect(component.showBanner()).toEqual(false);
      });
      it('should not show banner if test status is decided', () => {
        component.testStatus = TestStatus.Decided;
        expect(component.showBanner()).toEqual(false);
      });
      it('should not show banner if test status is started', () => {
        component.testStatus = TestStatus.Started;
        expect(component.showBanner()).toEqual(false);
      });
      it('should not show banner if test status is submitted', () => {
        component.testStatus = TestStatus.Submitted;
        expect(component.showBanner()).toEqual(false);
      });
    });
  });

});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { AdditionalCandidateDetailsComponent } from '../additional-candidate-details';

describe('AdditionalCandidateDetailsComponent', () => {
  let fixture: ComponentFixture<AdditionalCandidateDetailsComponent>;
  let component: AdditionalCandidateDetailsComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdditionalCandidateDetailsComponent],
      imports: [IonicModule],
    });

    fixture = TestBed.createComponent(AdditionalCandidateDetailsComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });
  describe('isCompleted', () => {
    [TestStatus.Completed, TestStatus.Submitted].forEach((val) => {
      it(`should return true if testStatus is ${val}`, () => {
        component.testStatus = val;
        expect(component.isCompleted()).toBeTruthy();
      });
    });
    it('should return false if testStatus is not in the array of values', () => {
      component.testStatus = TestStatus.Booked;
      expect(component.isCompleted()).toBeFalsy();
    });
  });
});

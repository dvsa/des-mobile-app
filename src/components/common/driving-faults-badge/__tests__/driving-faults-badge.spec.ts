import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DrivingFaultsBadgeComponent } from '../driving-faults-badge';

describe('DrivingFaultsBadgeComponent', () => {
  let fixture: ComponentFixture<DrivingFaultsBadgeComponent>;
  let component: DrivingFaultsBadgeComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DrivingFaultsBadgeComponent,
      ],
    });

    fixture = TestBed.createComponent(DrivingFaultsBadgeComponent);
    component = fixture.componentInstance;
  }));

  describe('DOM', () => {
    it('should display the number of faults in the DOM', () => {
      component.count = 5;

      fixture.detectChanges();

      const renderedCount = fixture.debugElement.query(By.css('.label')).nativeElement.innerHTML;
      expect(renderedCount).toBe('5');
    });
  });

  it('should not be visible when the fault count is 0', () => {
    component.count = 0;

    const divsInContainer = fixture.debugElement.queryAll(By.css('.counter-background'));

    expect(divsInContainer.length).toBe(0);
  });
});

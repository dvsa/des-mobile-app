import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DangerousFaultBadgeComponent } from '../dangerous-fault-badge';

describe('DangerousFaultBadgeComponent', () => {
  let fixture: ComponentFixture<DangerousFaultBadgeComponent>;
  let component: DangerousFaultBadgeComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DangerousFaultBadgeComponent,
      ],
    });

    fixture = TestBed.createComponent(DangerousFaultBadgeComponent);
    component = fixture.componentInstance;
  }));

  describe('DOM', () => {
    it('should display badge if showBadge is true', () => {
      component.showBadge = true;

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.background'))).toBeDefined();
    });
    it('should not display badge if showBadge is false', () => {
      component.showBadge = false;

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.background'))).toBeNull();
    });
  });
});

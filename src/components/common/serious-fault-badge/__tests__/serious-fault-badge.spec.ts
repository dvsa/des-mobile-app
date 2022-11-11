import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SeriousFaultBadgeComponent } from '../serious-fault-badge';

describe('SeriousFaultBadgeComponent', () => {
  let fixture: ComponentFixture<SeriousFaultBadgeComponent>;
  let component: SeriousFaultBadgeComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SeriousFaultBadgeComponent,
      ],
    });

    fixture = TestBed.createComponent(SeriousFaultBadgeComponent);
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

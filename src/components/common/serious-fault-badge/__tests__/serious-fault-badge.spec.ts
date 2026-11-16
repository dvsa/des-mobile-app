import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';
import { SeriousFaultBadgeComponent } from '../serious-fault-badge';

describe('SeriousFaultBadgeComponent', () => {
  let fixture: ComponentFixture<SeriousFaultBadgeComponent>;
  let component: SeriousFaultBadgeComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SeriousFaultBadgeComponent],
    });

    fixture = TestBed.createComponent(SeriousFaultBadgeComponent);
    component = fixture.componentInstance;
  });

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

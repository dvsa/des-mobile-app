import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { WarningBannerComponent } from '../warning-banner';

describe('WarningBanner', () => {
  let fixture: ComponentFixture<WarningBannerComponent>;
  let component: WarningBannerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WarningBannerComponent],

    });

    fixture = TestBed.createComponent(WarningBannerComponent);
    component = fixture.componentInstance;
  });

  describe('DOM', () => {
    it('should display the warning message', () => {
      const warningText = 'This is the warning text';
      component.warningText = warningText;

      fixture.detectChanges();
      const rendered = fixture.debugElement.query(By.css('.warning-text')).nativeElement.innerHTML;
      expect(rendered).toBe(warningText);
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { OfficeFooterComponent } from '../office-footer.component';

describe('OfficeFooterComponent', () => {
  let component: OfficeFooterComponent;
  let fixture: ComponentFixture<OfficeFooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OfficeFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OfficeFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('saveClick', () => {
    it('should emit saveClicked', () => {
      vi.spyOn(component.saveClicked, 'emit').mockReturnValue(undefined);
      component.saveClick();
      expect(component.saveClicked.emit).toHaveBeenCalled();
    });
  });
  describe('submitClick', () => {
    it('should emit submitClicked with the value of delegated', () => {
      vi.spyOn(component.submitClicked, 'emit').mockReturnValue(undefined);
      component.submitClick();
      expect(component.submitClicked.emit).toHaveBeenCalledWith(component.isDelegated);
    });
  });
  describe('continueClick', () => {
    it('should emit continueClicked', () => {
      vi.spyOn(component.continueClicked, 'emit').mockReturnValue(undefined);
      component.continueClick();
      expect(component.continueClicked.emit).toHaveBeenCalled();
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { AccompanimentCardComponent } from '@pages/waiting-room-to-car/components/accompaniment-card/accompaniment-card';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('AccompanimentCardComponent', () => {
  let fixture: ComponentFixture<AccompanimentCardComponent>;
  let component: AccompanimentCardComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AccompanimentCardComponent],
    });

    fixture = TestBed.createComponent(AccompanimentCardComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  });

  describe('instructorAccompanimentChanged', () => {
    it('should emit', () => {
      vi.spyOn(component.instructorAccompanimentChange, 'emit').mockReturnValue(undefined);
      component.instructorAccompanimentChanged();
      expect(component.instructorAccompanimentChange.emit).toHaveBeenCalled();
    });
  });
  describe('supervisorAccompanimentChanged', () => {
    it('should emit', () => {
      vi.spyOn(component.supervisorAccompanimentChange, 'emit').mockReturnValue(undefined);
      component.supervisorAccompanimentChanged();
      expect(component.supervisorAccompanimentChange.emit).toHaveBeenCalled();
    });
  });
  describe('otherAccompanimentChanged', () => {
    it('should emit', () => {
      vi.spyOn(component.otherAccompanimentChange, 'emit').mockReturnValue(undefined);
      component.otherAccompanimentChanged();
      expect(component.otherAccompanimentChange.emit).toHaveBeenCalled();
    });
  });
  describe('interpreterAccompanimentChanged', () => {
    it('should emit', () => {
      vi.spyOn(component.interpreterAccompanimentChange, 'emit').mockReturnValue(undefined);
      component.interpreterAccompanimentChanged();
      expect(component.interpreterAccompanimentChange.emit).toHaveBeenCalled();
    });
  });
});

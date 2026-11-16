import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormGroup } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ETACardComponent } from '../eta-card.component';

describe('EtaCardComponent', () => {
  let component: ETACardComponent;
  let fixture: ComponentFixture<ETACardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ETACardComponent],
    });

    fixture = TestBed.createComponent(ETACardComponent);
    component = fixture.componentInstance;
  });

  describe('getETAFaultText', () => {
    it('should return the expected ETA fault text for each combination of fault flags', () => {
      component.faults = undefined;
      expect(component.getETAFaultText()).toBe('');

      component.faults = { physical: true, verbal: false } as never;
      expect(component.getETAFaultText()).toBe('Physical');

      component.faults = { physical: false, verbal: true } as never;
      expect(component.getETAFaultText()).toBe('Verbal');

      component.faults = { physical: true, verbal: true } as never;
      expect(component.getETAFaultText()).toBe('Physical and verbal');
    });
  });

  describe('shouldDisplay', () => {
    it('should only display when either a physical or verbal fault is present', () => {
      component.faults = undefined;
      expect(component.shouldDisplay()).toBeFalsy();

      component.faults = { physical: true, verbal: false } as never;
      expect(component.shouldDisplay()).toBe(true);

      component.faults = { physical: false, verbal: true } as never;
      expect(component.shouldDisplay()).toBe(true);
    });
  });

  it('should emit the matching events when ETA change handlers are called', () => {
    vi.spyOn(component.footbrakeETAChanged, 'emit').mockReturnValue(undefined);
    vi.spyOn(component.handbrakeETAChanged, 'emit').mockReturnValue(undefined);
    vi.spyOn(component.otherETAChanged, 'emit').mockReturnValue(undefined);
    vi.spyOn(component.otherETATextChanged, 'emit').mockReturnValue(undefined);
    vi.spyOn(component.steeringETAChanged, 'emit').mockReturnValue(undefined);

    component.footbrakeETAChange();
    component.handbrakeETAChange();
    component.otherETAChange();
    component.otherETATextChange('new reason');
    component.steeringETAChange();

    expect(component.footbrakeETAChanged.emit).toHaveBeenCalled();
    expect(component.handbrakeETAChanged.emit).toHaveBeenCalled();
    expect(component.otherETAChanged.emit).toHaveBeenCalled();
    expect(component.otherETATextChanged.emit).toHaveBeenCalledWith('new reason');
    expect(component.steeringETAChanged.emit).toHaveBeenCalled();
  });

  describe('invalid', () => {
    it('should report invalid only when the other text control is dirty and invalid', () => {
      component.formGroup = new UntypedFormGroup({});
      component.faults = { physical: true, verbal: false } as never;
      component.otherETA = true;
      component.otherETAReason = '';

      component.ngOnChanges();

      expect(component.invalid).toBe(false);

      component.formControl.markAsDirty();

      expect(component.invalid).toBe(true);
    });

    it('should report the other text as invalid when the character limit is exceeded', () => {
      component.formGroup = new UntypedFormGroup({});
      component.faults = { physical: true, verbal: false } as never;
      component.otherETA = true;
      component.otherETAReason = 'A'.repeat(951);

      component.ngOnChanges();
      component.formControl.markAsDirty();
      component.characterCountChanged(-1);

      expect(component.formControl.hasError('charactersExceeded')).toBe(true);
      expect(component.invalid).toBe(true);
    });

    it('should not report the other text as invalid when the character limit is not exceeded', () => {
      component.formGroup = new UntypedFormGroup({});
      component.faults = { physical: true, verbal: false } as never;
      component.otherETA = true;
      component.otherETAReason = 'A'.repeat(950);

      component.ngOnChanges();
      component.formControl.markAsDirty();
      component.characterCountChanged(0);

      expect(component.formControl.hasError('charactersExceeded')).toBe(false);
      expect(component.invalid).toBe(false);
    });

    it('should report eta type invalid only when the eta type control is dirty and invalid', () => {
      component.formGroup = new UntypedFormGroup({});
      component.faults = { physical: true, verbal: false } as never;

      component.ngOnChanges();

      expect(component.etaTypeInvalid).toBe(false);

      component.etaTypeRequiredControl.markAsDirty();

      expect(component.etaTypeInvalid).toBe(true);
    });
  });
});

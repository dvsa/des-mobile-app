import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ETACardComponent } from '../eta-card.component';
import { UntypedFormGroup } from '@angular/forms';

describe('EtaCardComponent', () => {
  let component: ETACardComponent;
  let fixture: ComponentFixture<ETACardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ETACardComponent],
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
      expect(component.shouldDisplay()).toBeTrue();

      component.faults = { physical: false, verbal: true } as never;
      expect(component.shouldDisplay()).toBeTrue();
    });
  });

  it('should emit the matching events when ETA change handlers are called', () => {
    spyOn(component.footbrakeETAChanged, 'emit');
    spyOn(component.handbrakeETAChanged, 'emit');
    spyOn(component.otherETAChanged, 'emit');
    spyOn(component.otherETATextChanged, 'emit');
    spyOn(component.steeringETAChanged, 'emit');

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

      expect(component.invalid).toBeFalse();

      component.formControl.markAsDirty();

      expect(component.invalid).toBeTrue();
    });

    it('should report eta type invalid only when the eta type control is dirty and invalid', () => {
      component.formGroup = new UntypedFormGroup({});
      component.faults = { physical: true, verbal: false } as never;

      component.ngOnChanges();

      expect(component.etaTypeInvalid).toBeFalse();

      component.etaTypeRequiredControl.markAsDirty();

      expect(component.etaTypeInvalid).toBeTrue();
    });
  });
});

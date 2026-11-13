import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { VehicleDetailsCardComponent } from '@pages/waiting-room-to-car/components/vehicle-details-card/vehicle-details-card';

describe('VehicleDetailsCardComponent', () => {
  let fixture: ComponentFixture<VehicleDetailsCardComponent>;
  let component: VehicleDetailsCardComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, VehicleDetailsCardComponent],
    });

    fixture = TestBed.createComponent(VehicleDetailsCardComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  });

  describe('schoolVehicleDetailsChanged', () => {
    it('should emit the correct event', () => {
      vi.spyOn(component.schoolVehicleDetailsChange, 'emit').mockReturnValue(undefined);
      component.schoolVehicleDetailsChanged();
      expect(component.schoolVehicleDetailsChange.emit).toHaveBeenCalled();
    });
  });
  describe('dualVehicleDetailsChanged', () => {
    it('should emit the correct event', () => {
      vi.spyOn(component.dualVehicleDetailsChange, 'emit').mockReturnValue(undefined);
      component.dualVehicleDetailsChanged();
      expect(component.dualVehicleDetailsChange.emit).toHaveBeenCalled();
    });
  });
  describe('schoolBikeVehicleDetailsChanged', () => {
    it('should emit the correct event', () => {
      vi.spyOn(component.schoolBikeVehicleDetailsChange, 'emit').mockReturnValue(undefined);
      component.schoolBikeVehicleDetailsChanged();
      expect(component.schoolBikeVehicleDetailsChange.emit).toHaveBeenCalled();
    });
  });
});

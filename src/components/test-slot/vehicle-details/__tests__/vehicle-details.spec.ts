import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailsComponent } from '../vehicle-details';

describe('VehicleDetailsComponent', () => {
  let fixture: ComponentFixture<VehicleDetailsComponent>;
  let component: VehicleDetailsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleDetailsComponent],
    });

    fixture = TestBed.createComponent(VehicleDetailsComponent);
    component = fixture.componentInstance;
  });

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EtaCardComponent } from '../eta-card.component';

describe('EtaCardComponent', () => {
  let component: EtaCardComponent;
  let fixture: ComponentFixture<EtaCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EtaCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EtaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  describe('ETA', () => {
    it('should push ETA to an array if they are present', () => {
      component.data = {
        ETA: {
          physical: true,
          verbal: true,
        },
      };
      expect(component.eTA).toEqual('Physical and verbal');
    });
    it('should push None to an array if no ETA is present', () => {
      component.data = {
        ETA: null,
      };
      expect(component.eTA).toEqual('None');
    });
    it('should push Verbal to an array if only ETA Verbal is present', () => {
      component.data = {
        ETA: {
          verbal: true,
        },
      };
      expect(component.eTA).toEqual('Verbal');
    });
    it('should push Physical to an array if only ETA Physical is present', () => {
      component.data = {
        ETA: {
          physical: true,
        },
      };
      expect(component.eTA).toEqual('Physical');
    });
  });

  describe('shouldShowAdditionalETAPhysicalDetails', () => {
    it('should not show extended ETA when ETA data is missing', () => {
      component.data = undefined;

      expect(component.shouldShowAdditionalETAPhysicalDetails()).toBeFalse();
    });

    it('should not show extended ETA when physical type data is empty', () => {
      component.data = {
        ETA: {
          physicalType: {},
        },
      };

      expect(component.shouldShowAdditionalETAPhysicalDetails()).toBeFalse();
    });

    it('should show extended ETA when physical type details are present', () => {
      component.data = {
        ETA: {
          physicalType: {
            footbrake: true,
          },
        },
      };

      expect(component.shouldShowAdditionalETAPhysicalDetails()).toBeTrue();
    });
  });

  describe('getAdditionalETAPhysicalDetails', () => {
    it('should return an empty object when extended ETA data is missing', () => {
      component.data = undefined;

      expect(component.getAdditionalETAPhysicalDetails()).toEqual({});
    });

    it('should return all physical type details when extended ETA data is present', () => {
      const physicalType = {
        footbrake: true,
        steeringControl: false,
      };
      component.data = {
        ETA: {
          physicalType,
        },
      };

      expect(component.getAdditionalETAPhysicalDetails()).toEqual(physicalType);
    });
  });
});

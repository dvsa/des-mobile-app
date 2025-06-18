import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MotStatusDisplayTextComponent } from '../mot-status-display-text.component';

describe('MotStatusDisplayTextComponent', () => {
  let component: MotStatusDisplayTextComponent;
  let fixture: ComponentFixture<MotStatusDisplayTextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), MotStatusDisplayTextComponent],
    });

    fixture = TestBed.createComponent(MotStatusDisplayTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('isInvalidMOT', () => {
    it('returns true when motStatus is NOT_VALID', () => {
      component.motStatus = 'Not valid';
      expect(component.isInvalidMOT()).toBeTrue();
    });

    it('returns false when motStatus is not NOT_VALID', () => {
      component.motStatus = 'Valid';
      expect(component.isInvalidMOT()).toBeFalse();
    });

    it('returns false when motStatus is null', () => {
      component.motStatus = null;
      expect(component.isInvalidMOT()).toBeFalse();
    });
  });

  describe('getMotStatusText', () => {
    it('returns "Valid until {testExpiryDate}" when motStatus is VALID and motTestExpiryDate is provided', () => {
      component.motStatus = 'Valid';
      component.motTestExpiryDate = '2023-12-31';
      expect(component.getMotStatusText()).toBe('Valid until 2023-12-31');
    });

    it('returns "Valid" when motStatus is VALID and motTestExpiryDate is not provided', () => {
      component.motStatus = 'Valid';
      component.motTestExpiryDate = null;
      expect(component.getMotStatusText()).toBe('Valid');
    });

    it('returns motStatus text directly when motStatus is not invalid', () => {
      component.motStatus = 'No details';
      component.motTestExpiryDate = null;
      expect(component.getMotStatusText()).toBe('Unable to determine MOT status');
    });

    it('returns "Expired {testExpiryDate}" when motStatus is NOT_VALID and motTestExpiryDate is provided', () => {
      component.motStatus = 'Not valid';
      component.motTestExpiryDate = '2023-12-31';
      expect(component.getMotStatusText()).toBe('Expired 2023-12-31');
    });

    it('returns "Not valid" when motStatus is NOT_VALID and motTestExpiryDate is not provided', () => {
      component.motStatus = 'Not valid';
      component.motTestExpiryDate = null;
      expect(component.getMotStatusText()).toBe('Not valid');
    });
  });

  describe('getNoMOTDataText', () => {
    it('returns "Unable to determine MOT status for {registrationNumber}" when registrationNumber is provided and previousVRNs is not empty', () => {
      component.registrationNumber = 'ABC123';
      component.previousVRNs = ['DEF456', 'GHI789'];
      expect(component.getNoMOTDataText()).toBe('Unable to determine MOT status for ABC123');
    });

    it('returns "Unable to determine MOT status" when registrationNumber is not provided and previousVRNs is not empty', () => {
      component.registrationNumber = null;
      component.previousVRNs = ['DEF456', 'GHI789'];
      expect(component.getNoMOTDataText()).toBe('Unable to determine MOT status');
    });

    it('returns "No VRNs were checked for MOT" when previousVRNs is empty and registrationNumber is provided', () => {
      component.registrationNumber = 'ABC123';
      component.previousVRNs = [];
      expect(component.getNoMOTDataText()).toBe('No VRNs were checked for MOT');
    });

    it('returns "No VRNs were checked for MOT" when previousVRNs is empty and registrationNumber is not provided', () => {
      component.registrationNumber = null;
      component.previousVRNs = [];
      expect(component.getNoMOTDataText()).toBe('No VRNs were checked for MOT');
    });
  });
});

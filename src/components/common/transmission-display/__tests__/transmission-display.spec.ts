import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonicModule } from '@ionic/angular';
import { TransmissionDisplayComponent } from '../transmission-display';

enum GearBox {
  AUTOMATIC_NOT_SUBMITTED = 'Automatic - An automatic licence issued',
  AUTOMATIC_SUBMITTED = 'Automatic',
  MANUAL = 'Manual',
  CODE78 = 'Automatic - No code 78 - A manual licence issued',
}

describe('TransmissionDisplayComponent', () => {
  let fixture: ComponentFixture<TransmissionDisplayComponent>;
  let component: TransmissionDisplayComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule,
      ],
      declarations: [
        TransmissionDisplayComponent,
      ],
    });

    fixture = TestBed.createComponent(TransmissionDisplayComponent);
    component = fixture.componentInstance;
  }));

  describe('getTransmissionText', () => {
    it('should return appropriate string if Manual', () => {
      component.transmission = 'Manual';
      component.code78 = false;
      component.category = TestCategory.B;
      expect(component.getTransmissionText()).toEqual(GearBox.MANUAL);
    });
    it('should return appropriate string if Automatic', () => {
      component.transmission = 'Automatic';
      component.code78 = false;
      component.category = TestCategory.B;
      expect(component.getTransmissionText())
        .toEqual(GearBox.AUTOMATIC_NOT_SUBMITTED);
    });
    it('should return appropriate string if Manual and no code78', () => {
      component.transmission = 'Manual';
      component.code78 = false;
      component.category = TestCategory.C;
      expect(component.getTransmissionText()).toEqual(GearBox.MANUAL);
    });
    it('should return appropriate string if Manual and code78', () => {
      component.transmission = 'Manual';
      component.code78 = true;
      component.category = TestCategory.C;
      expect(component.getTransmissionText()).toEqual(GearBox.MANUAL);
    });
    it('should return appropriate string if Automatic and code78', () => {
      component.transmission = 'Automatic';
      component.code78 = true;
      component.category = TestCategory.C;
      expect(component.getTransmissionText())
        .toEqual(GearBox.AUTOMATIC_NOT_SUBMITTED);
    });
    it('should return appropriate string if Automatic no code78', () => {
      component.transmission = 'Automatic';
      component.code78 = false;
      component.category = TestCategory.C;
      expect(component.getTransmissionText())
        .toEqual(GearBox.CODE78);
    });
    it('should return appropriate string if Automatic anf Fail (missing code 78)', () => {
      component.transmission = 'Automatic';
      component.category = TestCategory.C;
      expect(component.getTransmissionText())
        .toEqual(GearBox.AUTOMATIC_NOT_SUBMITTED);
    });
  });
});

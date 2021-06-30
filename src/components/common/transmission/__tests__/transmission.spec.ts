import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormGroup } from '@angular/forms';
import { TransmissionType } from '@shared/models/transmission-type';
import { configureTestSuite } from 'ng-bullet';
import { TransmissionComponent } from '../transmission';

describe('transmissionComponent', () => {
  let fixture: ComponentFixture<TransmissionComponent>;
  let component: TransmissionComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        TransmissionComponent,
      ],
      imports: [
        IonicModule,
      ],
      providers: [
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(TransmissionComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
  }));

  describe('Class', () => {
    describe('TransmissionChanged', () => {
      it('should emit manual if manual transmission selected', () => {
        spyOn(component.transmissionChange, 'emit');
        const transmission = TransmissionType.Manual;
        component.transmissionChanged(transmission);
        expect(component.transmissionChange.emit).toHaveBeenCalledWith(transmission);
      });

      it('should emit automatic if automatic transmission selected', () => {
        spyOn(component.transmissionChange, 'emit');
        const transmission = TransmissionType.Automatic;
        component.transmissionChanged(transmission);
        expect(component.transmissionChange.emit).toHaveBeenCalledWith(transmission);
      });
    });

    describe('isInvalid', () => {
      it('should validate the field when it is valid', () => {
        component.ngOnChanges();
        component.formGroup.get(TransmissionComponent.fieldName).setValue(TransmissionType.Manual);
        fixture.detectChanges();
        const result: boolean = component.isInvalid();
        expect(result).toEqual(false);
      });

      it('should not validate the field when it is dirty', () => {
        component.ngOnChanges();
        component.formControl.markAsDirty();
        fixture.detectChanges();
        const result: boolean = component.isInvalid();
        expect(result).toEqual(true);
      });
    });
  });
});

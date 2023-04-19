import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppModule } from '@app/app.module';
import { ActivityCodeComponent } from '@components/common/activity-code/activity-code';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { ActivityCodeModel } from '@shared/constants/activity-code/activity-code.constants';
import { ActivityCodeModalEvent } from '@components/common/activity-code/acitivity-code-modal-event';

describe('ActivityCodeComponent', () => {
  let fixture: ComponentFixture<ActivityCodeComponent>;
  let component: ActivityCodeComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ActivityCodeComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
      providers: [
      ],
    });

    fixture = TestBed.createComponent(ActivityCodeComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('activityCodeChanged', () => {
      it('should emit activityCodeChange with passed value', () => {
        spyOn(component.activityCodeChange, 'emit');
        component.activityCodeChanged({ activityCode: '1' } as ActivityCodeModel);

        expect(component.activityCodeChange.emit).toHaveBeenCalledWith({ activityCode: '1' } as ActivityCodeModel);
      });
    });

    describe('onModalDismiss', () => {
      it('should call activityCodeChanged with data passed if event is SELECT_CODE', async () => {
        spyOn(component, 'activityCodeChanged');
        await component.onModalDismiss({ activityCode: '1' } as ActivityCodeModel, ActivityCodeModalEvent.SELECT_CODE);

        expect(component.activityCodeChanged).toHaveBeenCalledWith({ activityCode: '1' } as ActivityCodeModel);
      });
      it('should not call activityCodeChanged with data passed if event is CANCEL', async () => {
        spyOn(component, 'activityCodeChanged');
        await component.onModalDismiss({ activityCode: '1' } as ActivityCodeModel, ActivityCodeModalEvent.CANCEL);
        expect(component.activityCodeChanged).not.toHaveBeenCalled();
      });
    });

    describe('openActivityCodeListModal', () => {
      it('should call alertController.create if isSelectDisabled returns false', async () => {
        spyOn(component, 'isSelectDisabled').and.returnValue(false);
        spyOn(component.modalController, 'create').and.returnValue(Promise.resolve({
          present: () => Promise.resolve(),
          onWillDismiss: () => Promise.resolve({ data: true }),
        } as HTMLIonModalElement));
        await component.openActivityCodeListModal();
        expect(component.modalController.create).toHaveBeenCalled();
      });
    });

    describe('invalid', () => {
      it('should return true if the formControl is invalid and dirty', () => {
        component['formControl'] = null;
        component.formGroup = new UntypedFormGroup({});
        component.ngOnChanges();
        component['formControl'].setValidators([Validators.required]);

        component['formControl'].setValue(null);
        component['formControl'].markAsDirty();

        expect(component.invalid).toBeTruthy();
      });
      it('should return false if the formControl is valid and dirty', () => {
        component['formControl'] = null;
        component.formGroup = new UntypedFormGroup({});
        component.ngOnChanges();
        component['formControl'].setValidators([Validators.required]);

        component['formControl'].setValue(1);
        component['formControl'].markAsDirty();

        expect(component.invalid).toBeFalsy();
      });
      it('should return false if the formControl is invalid and clean', () => {
        component['formControl'] = null;
        component.formGroup = new UntypedFormGroup({});
        component.ngOnChanges();
        component['formControl'].setValidators([Validators.required]);

        component['formControl'].setValue(null);
        component['formControl'].markAsPristine();

        expect(component.invalid).toBeFalsy();
      });
      it('should return false if the formControl is valid and clean', () => {
        component['formControl'] = null;
        component.formGroup = new UntypedFormGroup({});
        component.ngOnChanges();
        component['formControl'].setValidators([Validators.required]);

        component['formControl'].setValue(1);
        component['formControl'].markAsPristine();

        expect(component.invalid).toBeFalsy();
      });
    });
  });

});

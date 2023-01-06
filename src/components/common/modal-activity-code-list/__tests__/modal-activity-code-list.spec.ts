import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { ModalActivityCodeListComponent } from '@components/common/modal-activity-code-list/modal-activity-code-list';
import { ActivityCodeModalEvent } from '@components/common/activity-code/acitivity-code-modal-event';
import { ActivityCodes } from '@shared/models/activity-codes';
import { ActivityCodeDescription } from '@shared/constants/activity-code/activity-code.constants';

describe('ModalActivityCodeListComponent', () => {
  let fixture: ComponentFixture<ModalActivityCodeListComponent>;
  let component: ModalActivityCodeListComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule,
      ],
      providers: [
        provideMockStore({ ...{} }),
      ],
    });

    fixture = TestBed.createComponent(ModalActivityCodeListComponent);
    component = fixture.componentInstance;
  }));

  describe('onCancel', () => {
    it('should call dismiss with ActivityCodeModalEvent.CANCEL', () => {
      spyOn(component.modalController, 'dismiss').and.returnValue(Promise.resolve(true));
      component.onCancel();

      expect(component.modalController.dismiss).toHaveBeenCalledWith(null, ActivityCodeModalEvent.CANCEL);
    });
  });

  describe('selectActivityCode', () => {
    it('should not call dismiss on modalController if isOptionDisabled returns true', () => {
      spyOn(component.modalController, 'dismiss').and.returnValue(Promise.resolve(true));
      component.selectActivityCode({ activityCode: '1', description: ActivityCodeDescription.FAIL });

      expect(component.modalController.dismiss).not.toHaveBeenCalled();
    });
    it('should call dismiss on modalController if isOptionDisabled returns false', () => {
      spyOn(component.modalController, 'dismiss').and.returnValue(Promise.resolve(true));
      component.selectActivityCode({ activityCode: '11', description: ActivityCodeDescription.FAIL });

      expect(component.modalController.dismiss).toHaveBeenCalledWith(
        { activityCode: '11', description: ActivityCodeDescription.FAIL }, ActivityCodeModalEvent.SELECT_CODE,
      );
    });
  });

  describe('isOptionDisabled', () => {
    it('should return true if the number contained in the passed in string is less than 4', () => {
      expect(component.isOptionDisabled('1')).toBe(true);
    });
    it('should return false if the number contained in the passed in string is greater than 4', () => {
      expect(component.isOptionDisabled('11')).toBe(false);
    });
  });

  describe('isActiveActivityCode', () => {
    it('should call true if the activity code passed in matches activityCodeModel.activityCode', () => {
      component.activityCodeModel = { activityCode: ActivityCodes.FAIL, description: ActivityCodeDescription.FAIL };

      expect(component.isActiveActivityCode(ActivityCodes.FAIL)).toBe(true);
    });
    it('should call false if the activity code passed in does not match activityCodeModel.activityCode', () => {
      component.activityCodeModel = { activityCode: ActivityCodes.FAIL, description: ActivityCodeDescription.FAIL };

      expect(component.isActiveActivityCode(ActivityCodes.PASS)).toBe(false);
    });
  });
});

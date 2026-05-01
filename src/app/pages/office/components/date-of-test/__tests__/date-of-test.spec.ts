import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DateTime, Duration } from '@shared/helpers/date-time';
import { PRESS_TIME_TO_ENABLE_EDIT } from '@shared/helpers/test-start-time';
import { DateOfTest } from '../date-of-test';

describe('DateOfTest', () => {
  let fixture: ComponentFixture<DateOfTest>;
  let component: DateOfTest;
  let mockDatetime: any = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DateOfTest],
      imports: [IonicModule],
    });

    fixture = TestBed.createComponent(DateOfTest);
    component = fixture.componentInstance;

    mockDatetime = jasmine.createSpyObj('IonDatetime', ['cancel', 'confirm', 'reset'], {
      value: '2025-06-15',
    }) as any;
  });

  describe('ngOnInit', () => {
    it('should initialize customTestDate with formatted input date', () => {
      component.dateOfTest = '15/06/2025';
      component.ngOnInit();
      expect(component.customTestDate).toBe('2025-06-15');
    });

    it('should set maxDate to today', () => {
      const today = new DateTime().format('yyyy-MM-dd');
      component.dateOfTest = '15/06/2025';
      component.ngOnInit();
      expect(component.maxDate).toBe(today);
    });

    it('should set minDate to one year ago', () => {
      const oneYearAgo = new DateTime().subtract(1, Duration.YEAR).format('yyyy-MM-dd');
      component.dateOfTest = '15/06/2025';
      component.ngOnInit();
      expect(component.minDate).toBe(oneYearAgo);
    });
  });

  describe('handleCancel', () => {
    it('should cancel the datetime picker and disable edit mode', async () => {
      mockDatetime.cancel.and.returnValue(Promise.resolve(true));
      component.editMode = true;

      await component.handleCancel(mockDatetime);

      expect(mockDatetime.cancel).toHaveBeenCalledWith(true);
      expect(component.editMode).toBe(false);
    });
  });

  describe('handleDone', () => {
    beforeEach(() => {
      spyOn(component.dateOfTestChange, 'emit');
      spyOn(component.setIsValidStartDateTime, 'emit');
    });

    it('should emit false and set isInvalid when date is invalid', async () => {
      spyOn(component, 'getIsValidStartDate').and.returnValue(false);
      mockDatetime.confirm.and.returnValue(Promise.resolve(true));
      mockDatetime.value = '2026-01-01';

      await component.handleDone(mockDatetime);

      expect(component.isInvalid).toBe(true);
      expect(component.setIsValidStartDateTime.emit).toHaveBeenCalledWith(false);
    });

    it('should emit true and update customTestDate when date is valid', async () => {
      const validDate = '2025-06-15';
      mockDatetime.value = validDate;
      mockDatetime.confirm.and.returnValue(Promise.resolve(true));

      await component.handleDone(mockDatetime);

      expect(component.isInvalid).toBe(false);
      expect(component.customTestDate).toBe(validDate);
      expect(component.setIsValidStartDateTime.emit).toHaveBeenCalledWith(true);
      expect(component.dateOfTestChange.emit).toHaveBeenCalledWith(validDate);
    });

    it('should disable edit mode after successful date selection', async () => {
      mockDatetime.value = '2025-06-15';
      mockDatetime.confirm.and.returnValue(Promise.resolve(true));
      component.editMode = true;

      await component.handleDone(mockDatetime);

      expect(component.editMode).toBe(false);
    });

    it('should close modal when datetime value is not set', async () => {
      mockDatetime.value = null;
      mockDatetime.confirm.and.returnValue(Promise.resolve(true));

      await component.handleDone(mockDatetime);

      expect(mockDatetime.confirm).toHaveBeenCalled();
    });

    it('should always call final confirm to close modal', async () => {
      mockDatetime.value = '2025-06-15';
      mockDatetime.confirm.and.returnValue(Promise.resolve(true));

      await component.handleDone(mockDatetime);

      expect(mockDatetime.confirm.calls.count()).toBeGreaterThanOrEqual(2);
    });
  });

  describe('onTouchStart', () => {
    it('should set isPressed to true', () => {
      component.isPressed = false;
      component.onTouchStart();
      expect(component.isPressed).toBe(true);
    });

    it('should enable edit mode after PRESS_TIME_TO_ENABLE_EDIT delay', fakeAsync(() => {
      component.editMode = false;
      component.isPressed = false;

      component.onTouchStart();
      tick(PRESS_TIME_TO_ENABLE_EDIT);

      expect(component.editMode).toBe(true);
    }));

    it('should not enable edit mode if touch is released before timeout', fakeAsync(() => {
      component.editMode = false;

      component.onTouchStart();
      component.onTouchEnd();
      tick(PRESS_TIME_TO_ENABLE_EDIT);

      expect(component.editMode).toBe(false);
    }));
  });

  describe('onTouchEnd', () => {
    it('should set isPressed to false', () => {
      component.isPressed = true;
      component.onTouchEnd();
      expect(component.isPressed).toBe(false);
    });
  });

  describe('disableEdit', () => {
    it('should set editMode to false', () => {
      component.editMode = true;
      component.disableEdit();
      expect(component.editMode).toBe(false);
    });
  });

  describe('handleEvents', () => {
    it('should call reset when buttonType is clear', async () => {
      mockDatetime.reset.and.returnValue(Promise.resolve(true));

      await component.handleEvents(mockDatetime, 'clear');

      expect(mockDatetime.reset).toHaveBeenCalled();
    });

    it('should call confirm and handleDone when buttonType is done', async () => {
      mockDatetime.confirm.and.returnValue(Promise.resolve(true));
      mockDatetime.value = '2025-06-15';
      spyOn(component, 'handleDone').and.returnValue(Promise.resolve());

      await component.handleEvents(mockDatetime, 'done');

      expect(mockDatetime.confirm).toHaveBeenCalled();
      expect(component.handleDone).toHaveBeenCalled();
    });

    it('should call cancel and handleCancel when buttonType is cancel', async () => {
      mockDatetime.cancel.and.returnValue(Promise.resolve(true));
      spyOn(component, 'handleCancel').and.returnValue(Promise.resolve());

      await component.handleEvents(mockDatetime, 'cancel');

      expect(mockDatetime.cancel).toHaveBeenCalled();
      expect(component.handleCancel).toHaveBeenCalled();
    });

    it('should return undefined for unknown buttonType', async () => {
      const result = await component.handleEvents(mockDatetime, 'unknown');
      expect(result).toBeUndefined();
    });
  });
});

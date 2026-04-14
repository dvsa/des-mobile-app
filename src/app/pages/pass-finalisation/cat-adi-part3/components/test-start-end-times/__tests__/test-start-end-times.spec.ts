import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonDatetime } from '@ionic/angular';
import { Store } from '@ngrx/store';
import {
  PassFinalisationAmendTimeCancelled,
  PassFinalisationAmendTimeConfirmed,
} from '@pages/pass-finalisation/pass-finalisation.actions';
import { PassFinalisationAmendTimeType, TestStartEndTimesComponent } from '../test-start-end-times';

describe('TestStartEndTimesComponent', () => {
  let component: TestStartEndTimesComponent;
  let fixture: ComponentFixture<TestStartEndTimesComponent>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockDatetime: jasmine.SpyObj<IonDatetime>;

  beforeEach(() => {
    mockStore = jasmine.createSpyObj('Store', ['dispatch']);
    mockDatetime = jasmine.createSpyObj('IonDatetime', ['reset', 'confirm', 'cancel']) as any;

    TestBed.configureTestingModule({
      declarations: [TestStartEndTimesComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: Store, useValue: mockStore }],
    });

    fixture = TestBed.createComponent(TestStartEndTimesComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
  });

  describe('ngOnInit', () => {
    it('should initialize minTime with startTime', () => {
      component.startTime = '10:00';
      component.endTime = '15:00';

      component.ngOnInit();

      expect(component.minTime).toBe('10:00');
    });

    it('should initialize maxTime with endTime', () => {
      component.startTime = '10:00';
      component.endTime = '15:00';

      component.ngOnInit();

      expect(component.maxTime).toBe('15:00');
    });

    it('should set minTime and maxTime to same value when times are equal', () => {
      component.startTime = '10:00';
      component.endTime = '10:00';

      component.ngOnInit();

      expect(component.minTime).toBe('10:00');
      expect(component.maxTime).toBe('10:00');
    });
  });

  describe('ngOnChanges', () => {
    it('should add startTime form control to formGroup', () => {
      component.ngOnChanges();

      expect(component.formGroup.get('startTime')).toBeDefined();
    });

    it('should add endTime form control to formGroup', () => {
      component.ngOnChanges();

      expect(component.formGroup.get('endTime')).toBeDefined();
    });

    it('should only add controls once on multiple calls', () => {
      component.ngOnChanges();
      const startTimeControl1 = component.formGroup.get('startTime');

      component.ngOnChanges();
      const startTimeControl2 = component.formGroup.get('startTime');

      expect(startTimeControl1).toBe(startTimeControl2);
    });

    it('should initialize form controls with null value', () => {
      component.ngOnChanges();

      expect(component.formGroup.get('startTime').value).toBeNull();
      expect(component.formGroup.get('endTime').value).toBeNull();
    });
  });

  describe('timeChanged', () => {
    it('should emit testStartTimeChange when control is start-time', () => {
      spyOn(component.testStartTimeChange, 'emit');

      component.timeChanged({ control: 'start-time', data: '09:30' });

      expect(component.testStartTimeChange.emit).toHaveBeenCalledWith('09:30');
    });

    it('should update minTime when control is start-time', () => {
      component.minTime = '10:00';

      component.timeChanged({ control: 'start-time', data: '09:00' });

      expect(component.minTime).toBe('09:00');
    });

    it('should emit testEndTimeChange when control is end-time', () => {
      spyOn(component.testEndTimeChange, 'emit');

      component.timeChanged({ control: 'end-time', data: '16:30' });

      expect(component.testEndTimeChange.emit).toHaveBeenCalledWith('16:30');
    });

    it('should update maxTime when control is end-time', () => {
      component.maxTime = '15:00';

      component.timeChanged({ control: 'end-time', data: '17:00' });

      expect(component.maxTime).toBe('17:00');
    });

    it('should not emit when control is not start-time or end-time', () => {
      spyOn(component.testStartTimeChange, 'emit');
      spyOn(component.testEndTimeChange, 'emit');

      component.timeChanged({ control: 'invalid-control', data: '10:00' });

      expect(component.testStartTimeChange.emit).not.toHaveBeenCalled();
      expect(component.testEndTimeChange.emit).not.toHaveBeenCalled();
    });

    it('should not emit when control is undefined', () => {
      spyOn(component.testStartTimeChange, 'emit');
      spyOn(component.testEndTimeChange, 'emit');

      component.timeChanged({ data: '10:00' });

      expect(component.testStartTimeChange.emit).not.toHaveBeenCalled();
      expect(component.testEndTimeChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('handleEvents', () => {
    it('should call reset on dateTime when buttonType is clear', async () => {
      mockDatetime.reset.and.returnValue(Promise.resolve());

      await component.handleEvents(mockDatetime, 'clear', PassFinalisationAmendTimeType.StartTime);

      expect(mockDatetime.reset).toHaveBeenCalled();
    });

    it('should dispatch PassFinalisationAmendTimeConfirmed when buttonType is done', async () => {
      mockDatetime.confirm.and.returnValue(Promise.resolve());

      await component.handleEvents(mockDatetime, 'done', PassFinalisationAmendTimeType.StartTime);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        PassFinalisationAmendTimeConfirmed(PassFinalisationAmendTimeType.StartTime)
      );
    });

    it('should call confirm on dateTime when buttonType is done', async () => {
      mockDatetime.confirm.and.returnValue(Promise.resolve());

      await component.handleEvents(mockDatetime, 'done', PassFinalisationAmendTimeType.StartTime);

      expect(mockDatetime.confirm).toHaveBeenCalledWith(true);
    });

    it('should dispatch PassFinalisationAmendTimeCancelled when buttonType is cancel', async () => {
      mockDatetime.cancel.and.returnValue(Promise.resolve());

      await component.handleEvents(mockDatetime, 'cancel', PassFinalisationAmendTimeType.EndTime);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        PassFinalisationAmendTimeCancelled(PassFinalisationAmendTimeType.EndTime)
      );
    });

    it('should call cancel on dateTime when buttonType is cancel', async () => {
      mockDatetime.cancel.and.returnValue(Promise.resolve());

      await component.handleEvents(mockDatetime, 'cancel', PassFinalisationAmendTimeType.EndTime);

      expect(mockDatetime.cancel).toHaveBeenCalledWith(true);
    });

    it('should return promise for clear button', async () => {
      mockDatetime.reset.and.returnValue(Promise.resolve());

      const result = component.handleEvents(mockDatetime, 'clear', PassFinalisationAmendTimeType.StartTime);

      expect(result instanceof Promise).toBe(true);
    });

    it('should return promise for done button', async () => {
      mockDatetime.confirm.and.returnValue(Promise.resolve());

      const result = component.handleEvents(mockDatetime, 'done', PassFinalisationAmendTimeType.StartTime);

      expect(result instanceof Promise).toBe(true);
    });

    it('should return promise for cancel button', async () => {
      mockDatetime.cancel.and.returnValue(Promise.resolve());

      const result = component.handleEvents(mockDatetime, 'cancel', PassFinalisationAmendTimeType.StartTime);

      expect(result instanceof Promise).toBe(true);
    });

    it('should not dispatch actions when buttonType is clear', async () => {
      mockDatetime.reset.and.returnValue(Promise.resolve());

      await component.handleEvents(mockDatetime, 'clear', PassFinalisationAmendTimeType.StartTime);

      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });

    it('should return undefined for unknown buttonType', async () => {
      const result = component.handleEvents(mockDatetime, 'unknown', PassFinalisationAmendTimeType.StartTime);

      expect(result).toBeUndefined();
    });

    it('should dispatch with StartTime when amending start time', async () => {
      mockDatetime.confirm.and.returnValue(Promise.resolve());

      await component.handleEvents(mockDatetime, 'done', PassFinalisationAmendTimeType.StartTime);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        PassFinalisationAmendTimeConfirmed(PassFinalisationAmendTimeType.StartTime)
      );
    });

    it('should dispatch with EndTime when amending end time', async () => {
      mockDatetime.confirm.and.returnValue(Promise.resolve());

      await component.handleEvents(mockDatetime, 'done', PassFinalisationAmendTimeType.EndTime);

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        PassFinalisationAmendTimeConfirmed(PassFinalisationAmendTimeType.EndTime)
      );
    });
  });
});

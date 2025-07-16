import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { IonInput, IonicModule } from '@ionic/angular';
import { DateTime } from '@shared/helpers/date-time';
import { MockComponent } from 'ng-mocks';
import { TimePickerComponent } from '../time-picker.component';

describe('TimePickerComponent', () => {
  let component: TimePickerComponent;
  let fixture: ComponentFixture<TimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimePickerComponent],
      imports: [IonicModule, MockComponent(ModalAlertTitleComponent), AppModule],
      providers: [{ provide: ChangeDetectorRef, useValue: { detectChanges: jasmine.createSpy('detectChanges') } }],
    }).compileComponents();

    fixture = TestBed.createComponent(TimePickerComponent);
    component = fixture.componentInstance;
    component.hourInputBox = jasmine.createSpyObj<IonInput>('IonInput', ['setFocus', 'getInputElement'], { value: '' });
    component.minuteInputBox = jasmine.createSpyObj<IonInput>('IonInput', ['setFocus', 'getInputElement'], {
      value: '',
    });
    fixture.detectChanges();
  });

  const formatFakeTimeString = (date: Date, time: string): string => {
    return `${date.getFullYear()}-${date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate()}T${time}`;
  };

  describe('inputChanged', () => {
    it('emits onTimeChanged with formatted time when inputChanged is called', () => {
      spyOn(component.onTimeChanged, 'emit');
      component.selectedHour = '12';
      component.selectedMinute = '34';
      component.inputChanged();
      expect(component.onTimeChanged.emit).toHaveBeenCalledWith(jasmine.stringMatching(/T12:34$/));
    });

    it('sets time to minTime and emits when selected time is less than minTime', () => {
      spyOn(component, 'setTime').and.callThrough();
      spyOn(component.onTimeChanged, 'emit');
      const date = new Date();
      const minTime = formatFakeTimeString(date, '08:00');
      component.minTime = minTime;
      component.selectedHour = '07';
      component.selectedMinute = '59';
      component.inputChanged();
      expect(component.setTime).toHaveBeenCalledWith(minTime);
      expect(component.onTimeChanged.emit).toHaveBeenCalledWith(DateTime.at(minTime).format('YYYY-MM-DDTHH:mm'));
    });

    it('sets time to maxTime and emits when selected time is greater than maxTime', () => {
      spyOn(component, 'setTime').and.callThrough();
      spyOn(component.onTimeChanged, 'emit');
      const date = new Date();
      const maxTime = formatFakeTimeString(date, '19:00');
      component.maxTime = maxTime;
      component.selectedHour = '19';
      component.selectedMinute = '00';
      component.inputChanged();
      expect(component.setTime).toHaveBeenCalledWith(maxTime);
      expect(component.onTimeChanged.emit).toHaveBeenCalledWith(maxTime);
    });
  });

  describe('iterateNumbers', () => {
    it('should wrap hour to maximum when iterated below minimum', () => {
      component.selectedHour = '00';
      component.iterateNumbers(component.TimeUnits.HOUR, -1, 0, 23);
      expect(component.selectedHour).toBe('23');
    });

    it('should wrap minute to minimum when iterated above maximum', () => {
      component.selectedMinute = '59';
      component.iterateNumbers(component.TimeUnits.MINUTE, 1, 0, 59);
      expect(component.selectedMinute).toBe('00');
    });
  });

  describe('padWithZero', () => {
    it('should pad single digit numbers with zero', () => {
      expect(component.padWithZero(5)).toBe('05');
      expect(component.padWithZero(12)).toBe('12');
    });
  });

  describe('interpretTime', () => {
    it('should interpretTime and set selectedHour and selectedMinute', () => {
      component.interpretTime('2023-01-01T09:45');
      expect(component.selectedHour).toBe('09');
      expect(component.selectedMinute).toBe('45');
    });
  });

  describe('shouldShowUpArrow', () => {
    it('returns true if maxTime is not set', () => {
      expect(component.shouldShowUpArrow(component.TimeUnits.HOUR)).toBeTrue();
    });

    it('returns false if incrementing would exceed maxTime', () => {
      component.maxTime = '2023-01-01T10:00';
      component.selectedHour = '10';
      component.selectedMinute = '00';
      expect(component.shouldShowUpArrow(component.TimeUnits.HOUR)).toBeFalse();
    });
  });

  describe('shouldShowDownArrow', () => {
    it('returns true if minTime is not set', () => {
      expect(component.shouldShowDownArrow(component.TimeUnits.MINUTE)).toBeTrue();
    });

    it('returns false if decrementing would go below minTime', () => {
      const date = new Date();
      component.minTime = formatFakeTimeString(date, '08:00');
      component.selectedHour = '08';
      component.selectedMinute = '00';
      expect(component.shouldShowDownArrow(component.TimeUnits.HOUR)).toBeFalse();
    });
  });

  describe('inputEnteredManually', () => {
    it('sets selectedHour to minimum if input is empty', () => {
      spyOn(component, 'iterateNumbers');
      component.inputEnteredManually(component.TimeUnits.HOUR, '');
      expect(component.selectedHour).toBe('0');
    });

    it('sets selectedMinute to minimum if input is empty', () => {
      spyOn(component, 'iterateNumbers');
      component.inputEnteredManually(component.TimeUnits.MINUTE, '');
      expect(component.selectedMinute).toBe('0');
    });
  });
});

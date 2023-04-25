import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonDatetime, IonicModule } from '@ionic/angular';
import { DateTimeInputComponent, DisplayType } from '@components/common/datetime-input/date-time-input.component';

describe('DateTimeInputComponent', () => {
  let fixture: ComponentFixture<DateTimeInputComponent>;
  let component: DateTimeInputComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DateTimeInputComponent,
      ],
      imports: [IonicModule],
    });

    fixture = TestBed.createComponent(DateTimeInputComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });

  describe('formatDisplayDate', () => {
    it('should display a date in the format of DD/MM/YYYY', () => {
      expect(component.formatDisplayDate('1111-11-11'))
        .toEqual('11/11/1111');
    });
  });

  describe('buttonEmit', () => {
    it('should emit customButtonEvent with the correct parameters', () => {
      spyOn(component.customButtonEvent, 'emit');
      component.buttonEmit({} as IonDatetime, 'test');
      expect(component.customButtonEvent.emit)
        .toHaveBeenCalledWith({
          data: {} as IonDatetime,
          buttonType: 'test',
        });
    });
  });

  describe('onSelected', () => {
    it('should emit blank variables if the DisplayType is not type Date or Time', () => {
      spyOn(component.onDataPicked, 'emit');
      component.control = 'test';
      component.onSelected({} as IonDatetime, null);
      expect(component.onDataPicked.emit)
        .toHaveBeenCalledWith({
          data: '',
          control: 'test',
        });
      expect(component.displayValue)
        .toBe('');
    });
    it('should emit event.value in the correct format and set displayValue to the correct value'
      + ' if the DisplayType is Time', () => {
      spyOn(component.onDataPicked, 'emit');
      component.control = 'test';
      component.onSelected({ value: '1/2/1000/12:11' } as IonDatetime, DisplayType.Time);
      expect(component.onDataPicked.emit)
        .toHaveBeenCalledWith({
          data: '1000-01-02T12:11',
          control: 'test',
        });
      expect(component.displayValue)
        .toBe('12:11');

    });
    it('should emit event.value in the correct format and set displayValue to the correct value'
      + ' if the DisplayType is Date', () => {
      spyOn(component.onDataPicked, 'emit');
      component.control = 'test';
      component.onSelected({ value: '1/2/1000' } as IonDatetime, DisplayType.Date);
      expect(component.onDataPicked.emit)
        .toHaveBeenCalledWith({
          data: '1000-01-02',
          control: 'test',
        });
      expect(component.displayValue)
        .toBe('02/01/1000');

    });
  });

  describe('formatDisplayTime', () => {
    it('should display a date in the format of HH:mm', () => {
      expect(component.formatDisplayTime('1234-11-28T21:23'))
        .toEqual('21:23');
    });
    it('should display "Invalid date" when given invalid data"', () => {
      expect(component.formatDisplayTime('AAAAAA'))
        .toEqual('Invalid date');
    });
  });
});

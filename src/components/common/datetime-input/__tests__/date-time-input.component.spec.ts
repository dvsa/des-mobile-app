import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DateTimeInputComponent } from '@components/common/datetime-input/date-time-input.component';

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
    expect(component).toBeTruthy();
  });

  describe('formatDisplayDate', () => {
    it('should display a date in the format of DD/MM/YYYY', () => {
      expect(component.formatDisplayDate('1111-11-11')).toEqual('11/11/1111');
    });
    it('should display "Invalid date" when given invalid data"', () => {
      expect(component.formatDisplayDate('AAAAAA')).toEqual('Invalid date');
    });
  });

  describe('formatDisplayTime', () => {
    it('should display a date in the format of HH:mm', () => {
      expect(component.formatDisplayTime('1234-11-28T21:23')).toEqual('21:23');
    });
    it('should display "Invalid date" when given invalid data"', () => {
      expect(component.formatDisplayTime('AAAAAA')).toEqual('Invalid date');
    });
  });
});

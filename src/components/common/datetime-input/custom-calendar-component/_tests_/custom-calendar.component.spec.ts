import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { IonicModule } from '@ionic/angular';

import { CustomCalendarComponent } from '../custom-calendar.component';

const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

describe('CustomCalendarComponent', () => {
  let component: CustomCalendarComponent;
  let fixture: ComponentFixture<CustomCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }],
      imports: [CustomCalendarComponent, IonicModule.forRoot()],
    });

    fixture = TestBed.createComponent(CustomCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

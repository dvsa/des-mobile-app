import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { LogHelper } from '../../../../app/providers/logs/logs-helper';
import { LogHelperMock } from '../../../../app/providers/logs/__mocks__/logs-helper.mock';
import { DateComponent } from '../date';

describe('TimeComponent', () => {
  let component: DateComponent;
  let fixture: ComponentFixture<DateComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [DateComponent],
      imports: [IonicModule],
      providers: [
        { provide: LogHelper, useClass: LogHelperMock },
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DateComponent);
    component = fixture.componentInstance;
    component.date = '2018-12-31T10:04:00+00:00';
  }));

  describe('DOM', () => {
    let componentEl: DebugElement;

    beforeEach(() => {
      componentEl = fixture.debugElement;
    });

    describe('Date output ', () => {
      it('should be displayed', () => {
        const dateSpan: HTMLElement = componentEl.query(By.css('p'))
          .nativeElement;
        fixture.detectChanges();
        expect(dateSpan.textContent).toBe('31/12/2018');
      });
    });
  });
});

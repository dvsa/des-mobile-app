import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { DateComponent } from '../date';

xdescribe('TimeComponent', () => {
  let component: DateComponent;
  let fixture: ComponentFixture<DateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DateComponent],
      imports: [IonicModule],
      providers: [{ provide: LogHelper, useClass: LogHelperMock }],
    });

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
        const dateSpan: HTMLElement = componentEl.query(By.css('p')).nativeElement;
        fixture.detectChanges();
        expect(dateSpan.textContent).toBe('31/12/2018');
      });
    });
  });
});

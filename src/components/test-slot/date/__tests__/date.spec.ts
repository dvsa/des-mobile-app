import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { LogHelper } from '@providers/logs/logs-helper';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { MockComponent } from 'ng-mocks';
import { HeaderComponent } from '@components/common/header-component/header.component';
import { DateComponent } from '../date';

describe('TimeComponent', () => {
  let component: DateComponent;
  let fixture: ComponentFixture<DateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DateComponent,
        MockComponent(HeaderComponent),
      ],
      imports: [IonicModule],
      providers: [
        { provide: LogHelper, useClass: LogHelperMock },
      ],
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
        const dateSpan: HTMLElement = componentEl.query(By.css('p'))
          .nativeElement;
        fixture.detectChanges();
        expect(dateSpan.textContent).toBe('31/12/2018');
      });
    });
  });
});

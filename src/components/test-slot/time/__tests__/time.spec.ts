import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { LogHelper } from '@providers/logs/logs-helper';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { TimeComponent } from '../time';

describe('TimeComponent', () => {
  let component: TimeComponent;
  let fixture: ComponentFixture<TimeComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [TimeComponent],
      imports: [IonicModule],
      providers: [
        { provide: LogHelper, useClass: LogHelperMock },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(TimeComponent);
    component = fixture.componentInstance;
    component.time = '2018-12-10T10:04:00+00:00';
    component.testComplete = true;
  }));

  describe('DOM', () => {
    let componentEl: DebugElement;

    beforeEach(() => {
      componentEl = fixture.debugElement;
    });

    describe('Time output ', () => {
      it('should be displayed', () => {
        const timeSpan: HTMLElement = componentEl.query(By.css('h2'))
          .nativeElement;
        fixture.detectChanges();
        expect(timeSpan.textContent).toBe('10:04');
      });
    });

    describe('class if test complete ', () => {
      it('should be time-test-complete-text', () => {
        fixture.detectChanges();
        const timeSpan: any = componentEl.query(By.css('h2'));
        expect(timeSpan.classes['time-test-complete-text']).not.toBeNull();
      });
    });
  });
});

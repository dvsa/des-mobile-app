import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { LogHelper } from '@providers/logs/logs-helper';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { MockComponent } from 'ng-mocks';
import { HeaderComponent } from '@components/common/header-component/header.component';
import { TimeComponent } from '../time';

describe('TimeComponent', () => {
  let component: TimeComponent;
  let fixture: ComponentFixture<TimeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimeComponent,
        MockComponent(HeaderComponent),
      ],
      imports: [IonicModule],
      providers: [
        { provide: LogHelper, useClass: LogHelperMock },
      ],
    });

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
        fixture.detectChanges();
        const timeSpan: any = componentEl.query(By.css('#candidate-details-title')).nativeElement;
        expect(timeSpan.textContent).toBe(' 10:04 ');
      });
    });

    describe('class if test complete ', () => {
      it('should be time-test-complete-text', () => {
        fixture.detectChanges();
        const timeSpan: any = componentEl.query(By.css('header-component'));
        expect(timeSpan.classes['time-test-complete-text']).not.toBeNull();
      });
    });
  });
});

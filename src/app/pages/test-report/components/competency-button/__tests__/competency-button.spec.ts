import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '@app/app.module';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { CompetencyButtonComponent } from '../competency-button';

describe('CompetencyButtonComponent', () => {
  let fixture: ComponentFixture<CompetencyButtonComponent>;
  let component: CompetencyButtonComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        CompetencyButtonComponent,
      ],
      imports: [
        AppModule,
        IonicModule,
      ],
      providers: [
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(CompetencyButtonComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('onTapEvent', () => {
      it('should not call onTap if disabled is true', () => {
        component.disabled = true;
        component.onTap = () => {};
        spyOn(component, 'onTap');
        component.onTapEvent();
        expect(component.onTap).not.toHaveBeenCalled();
      });
    });
    describe('onPressEvent', () => {
      it('should not call onPress if disabled is true', () => {
        component.disabled = true;
        component.onPress = () => {};
        spyOn(component, 'onPress');
        component.onPressEvent();
        expect(component.onPress).not.toHaveBeenCalled();
      });
    });
    describe('onTouchStart', () => {
      it('should not set touchState to true if disabled is true', () => {
        component.disabled = true;
        component.onTouchStart();
        expect(component.touchState).toEqual(false);
      });
    });
    it('should call the tap function when a tap event is triggered', () => {
      const tapSpy = jasmine.createSpy('onTapEvent');
      component.onTapEvent = tapSpy;
      const button = fixture.debugElement.query(By.css('.competency-button'));
      button.triggerEventHandler('tap', null);
      expect(tapSpy).toHaveBeenCalled();
    });

    it('should call the press function when a press event is triggered', () => {
      const pressSpy = jasmine.createSpy('onPressEvent');
      component.onPressEvent = pressSpy;
      const button = fixture.debugElement.query(By.css('.competency-button'));
      button.triggerEventHandler('press', null);
      expect(pressSpy).toHaveBeenCalled();
    });
  });

  describe('DOM', () => {

    describe('Ripple effect', () => {
      it('should have added no classes to the competency button', () => {
        const competencyButton = fixture.debugElement.query(By.css('.competency-button'));
        expect(competencyButton.nativeElement.className).toEqual('competency-button');
      });
      it('should not add the activated class when the button is pressed if disabled is true', () => {
        component.disabled = true;
        component.onTouchStart();
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('.competency-button'));
        expect(button).toBeDefined();
        expect(button.nativeElement.className).not.toContain('activated');
        expect(component.touchState).toEqual(false);
      });

      it('should add the activated class when the button is pressed', () => {
        component.onTouchStart();
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('.competency-button'));

        expect(button).toBeDefined();
        expect(button.nativeElement.className).toContain('activated');
        expect(component.touchState).toEqual(true);
      });

      it('should remove the activated class after a specified delay when the button is not pressed', (done) => {
        component.onTouchEnd();
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('.competency-button'));
        setTimeout(
          () => {
            fixture.detectChanges();

            expect(button).toBeDefined();
            expect(button.nativeElement.className).not.toContain('activated');
            expect(component.touchState).toEqual(false);
            done();
          },
          component.touchStateDelay,
        );
      });

      it('should add the ripple effect animation css class', () => {
        component.onPressEvent();
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('.competency-button'));

        expect(button).toBeDefined();
        expect(button.nativeElement.className).toContain('ripple-effect');
      });
      it('should not add the ripple effect animation if disabled is true', () => {
        component.disabled = true;
        component.onPressEvent();
        const button = fixture.debugElement.query(By.css('.competency-button'));
        expect(button).toBeDefined();
        expect(button.nativeElement.className).not.toContain('ripple-effect');
      });

      it('should remove the ripple effect animation css class within the required time frame', (done) => {
        component.onPressEvent();
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('.competency-button'));
        setTimeout(
          () => {
            fixture.detectChanges();

            expect(button).toBeDefined();
            expect(button.nativeElement.className).not.toContain('ripple-effect');
            done();
          },
          component.rippleEffectAnimationDuration,
        );
      });

      it('should not add the ripple effect animation css class when ripple is disabled', () => {
        component.ripple = false;
        component.onPressEvent();
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('.competency-button'));

        expect(button).toBeDefined();
        expect(button.nativeElement.className).not.toContain('ripple-effect');
      });
    });
  });
});

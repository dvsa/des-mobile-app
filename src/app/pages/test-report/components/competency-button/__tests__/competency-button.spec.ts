import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppModule } from '@app/app.module';
import { IonicModule } from '@ionic/angular';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { CompetencyButtonComponent } from '../competency-button';

describe('CompetencyButtonComponent', () => {
  let fixture: ComponentFixture<CompetencyButtonComponent>;
  let component: CompetencyButtonComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompetencyButtonComponent],
      imports: [AppModule, IonicModule],
      providers: [{ provide: DateTimeProvider, useClass: DateTimeProviderMock }],
    });

    fixture = TestBed.createComponent(CompetencyButtonComponent);
    component = fixture.componentInstance;
  });

  describe('Class', () => {
    describe('onPointerDown', () => {
      it('should emit onTap event immediately when pointer pressed', () => {
        spyOn(component.onTap, 'emit');
        component.onPointerDown(new PointerEvent('pointerdown'));
        expect(component.onTap.emit).toHaveBeenCalled();
      });

      it('should not emit onTap when disabled', () => {
        component.disabled = true;
        spyOn(component.onTap, 'emit');
        component.onPointerDown(new PointerEvent('pointerdown'));
        expect(component.onTap.emit).not.toHaveBeenCalled();
      });

      it('should emit onPress event after longPressDelay', (done) => {
        spyOn(component.onPress, 'emit');
        component.onPointerDown(new PointerEvent('pointerdown'));
        setTimeout(() => {
          expect(component.onPress.emit).toHaveBeenCalled();
          done();
        }, component.longPressDelay + 10);
      });

      it('should not emit onPress when disabled', (done) => {
        component.disabled = true;
        spyOn(component.onPress, 'emit');
        component.onPointerDown(new PointerEvent('pointerdown'));
        setTimeout(() => {
          expect(component.onPress.emit).not.toHaveBeenCalled();
          done();
        }, component.longPressDelay + 10);
      });

      it('should trigger ripple effect when onPress is emitted and ripple is enabled', (done) => {
        component.allowRipple = true;
        component.onPointerDown(new PointerEvent('pointerdown'));
        setTimeout(() => {
          expect(component.rippleState()).toEqual(true);
          done();
        }, component.longPressDelay + 10);
      });

      it('should not trigger ripple effect when ripple is disabled', (done) => {
        component.allowRipple = false;
        component.onPointerDown(new PointerEvent('pointerdown'));
        setTimeout(() => {
          expect(component.rippleState()).toEqual(false);
          done();
        }, component.longPressDelay + 10);
      });
    });

    describe('onPointerEnd', () => {
      it('should cancel long press when pointer released before longPressDelay', (done) => {
        spyOn(component.onPress, 'emit');
        component.onPointerDown(new PointerEvent('pointerdown'));
        component.onPointerEnd();
        setTimeout(() => {
          expect(component.onPress.emit).not.toHaveBeenCalled();
          done();
        }, component.longPressDelay + 10);
      });

      it('should cancel long press when pointer leaves before longPressDelay', (done) => {
        spyOn(component.onPress, 'emit');
        component.onPointerDown(new PointerEvent('pointerdown'));
        component.onPointerEnd();
        setTimeout(() => {
          expect(component.onPress.emit).not.toHaveBeenCalled();
          done();
        }, component.longPressDelay + 10);
      });
    });

    describe('onTouchStart', () => {
      it('should set touchState to true when called', () => {
        component.onTouchStart();
        expect(component.touchState()).toEqual(true);
      });

      it('should not set touchState when disabled', () => {
        component.disabled = true;
        component.onTouchStart();
        expect(component.touchState()).toEqual(false);
      });
    });

    describe('onTouchEnd', () => {
      it('should set touchState to false after touchStateDelay', (done) => {
        component.onTouchStart();
        component.onTouchEnd();
        setTimeout(() => {
          expect(component.touchState()).toEqual(false);
          done();
        }, component.touchStateDelay + 10);
      });

      it('should not change touchState when disabled', () => {
        component.disabled = true;
        component.touchState.set(true);
        component.onTouchEnd();
        expect(component.touchState()).toEqual(true);
      });
    });

    describe('DOM interactions', () => {
      it('should apply activated class when touchState is true', () => {
        component.touchState.set(true);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('.competency-button'));
        expect(button.nativeElement.className).toContain('activated');
      });

      it('should apply ripple-effect class when rippleState is true', () => {
        component.rippleState.set(true);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('.competency-button'));
        expect(button.nativeElement.className).toContain('ripple-effect');
      });

      it('should remove ripple effect after rippleEffectAnimationDuration', (done) => {
        component.rippleState.set(true);
        fixture.detectChanges();
        setTimeout(() => {
          component.rippleState.set(false);
          fixture.detectChanges();
          const button = fixture.debugElement.query(By.css('.competency-button'));
          expect(button.nativeElement.className).not.toContain('ripple-effect');
          done();
        }, component.rippleEffectAnimationDuration);
      });
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
        expect(component.touchState()).toEqual(false);
      });

      it('should add the activated class when the button is pressed', () => {
        component.onTouchStart();
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('.competency-button'));

        expect(button).toBeDefined();
        expect(button.nativeElement.className).toContain('activated');
        expect(component.touchState()).toEqual(true);
      });

      it('should remove the activated class after a specified delay when the button is not pressed', (done) => {
        component.onTouchEnd();
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('.competency-button'));
        setTimeout(() => {
          fixture.detectChanges();

          expect(button).toBeDefined();
          expect(button.nativeElement.className).not.toContain('activated');
          expect(component.touchState()).toEqual(false);
          done();
        }, component.touchStateDelay);
      });

      it('should add the ripple effect animation css class', () => {
        component.triggerRipple();
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('.competency-button'));

        expect(button).toBeDefined();
        expect(button.nativeElement.className).toContain('ripple-effect');
      });
      it('should not add the ripple effect animation if disabled is true', () => {
        component.disabled = true;
        component.triggerRipple();
        const button = fixture.debugElement.query(By.css('.competency-button'));
        expect(button).toBeDefined();
        expect(button.nativeElement.className).not.toContain('ripple-effect');
      });

      it('should remove the ripple effect animation css class within the required time frame', (done) => {
        component.triggerRipple();
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('.competency-button'));
        setTimeout(() => {
          fixture.detectChanges();

          expect(button).toBeDefined();
          expect(button.nativeElement.className).not.toContain('ripple-effect');
          done();
        }, component.rippleEffectAnimationDuration);
      });
    });
  });
});

// eslint-disable-next-line max-classes-per-file
import {
  Component, DebugElement, ElementRef,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputRestrictionNumbersDirective } from '@directives/input-restriction-numbers.directive';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <form>
      <input type="text" numbersOnly />
    </form>
  `,
})
class TestInputRestrictionNumbersComponent {
}

class ElementRefMock extends ElementRef {
  nativeElement = {};
}

describe('Directive: InputRestrictionNumbersDirective', () => {
  let fixture: ComponentFixture<TestInputRestrictionNumbersComponent>;
  let directiveEl: DebugElement;
  let directiveInstance: InputRestrictionNumbersDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        InputRestrictionNumbersDirective,
        TestInputRestrictionNumbersComponent,
      ],
      providers: [
        { provide: ElementRef, useValue: ElementRefMock },
      ],
    });
    fixture = TestBed.createComponent(TestInputRestrictionNumbersComponent);
    directiveEl = fixture.debugElement.query(By.directive(InputRestrictionNumbersDirective));
    directiveInstance = directiveEl.injector.get(InputRestrictionNumbersDirective);

  });

  it('should be created', () => {
    expect(directiveEl).not.toBeNull();
  });

  describe('onKeyDown', () => {
    it('should call preventDefault if key is not listed in control keys and is not between 0 and 9', () => {
      const e = {
        preventDefault() {
        },
        key: 10,
      } as unknown as KeyboardEvent;
      spyOn(e, 'preventDefault');
      directiveInstance.onKeyDown(e);
      expect(e.preventDefault).toHaveBeenCalled();
    });
    it('should not call preventDefault if key is not listed in control keys and is between 0 and 9', () => {
      const e = {
        preventDefault() {
        },
        key: 8,
      } as unknown as KeyboardEvent;
      spyOn(e, 'preventDefault');
      directiveInstance.onKeyDown(e);
      expect(e.preventDefault).not.toHaveBeenCalled();
    });
    it('should return undefined if key is listed in control keys', () => {
      const e = {
        preventDefault() {
        },
        key: 'ArrowRight',
      } as unknown as KeyboardEvent;
      expect(directiveInstance.onKeyDown(e)).toEqual(undefined);
    });
  });
});

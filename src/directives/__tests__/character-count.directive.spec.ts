// eslint-disable-next-line max-classes-per-file
import {
  Component, DebugElement, ElementRef,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterCountDirective } from '@directives/character-count.directive';
import { By } from '@angular/platform-browser';

@Component({
  template: '<input type="text" charCount>',
})
class TestCharCountComponent {
}

class ElementRefMock extends ElementRef {
  nativeElement = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getAttribute(qualifiedName: string): string | null {
      return '10';
    },
  };
}

describe('Directive: CharacterCountDirective', () => {
  let fixture: ComponentFixture<TestCharCountComponent>;
  let directiveEl: DebugElement;
  let directiveInstance: CharacterCountDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestCharCountComponent,
        CharacterCountDirective,
      ],
      providers: [
        { provide: ElementRef, useValue: ElementRefMock },
      ],
    });
    fixture = TestBed.createComponent(TestCharCountComponent);
    directiveEl = fixture.debugElement.query(By.directive(CharacterCountDirective));
    directiveInstance = directiveEl.injector.get(CharacterCountDirective);
    spyOn(directiveInstance.onCharacterCountChanged, 'emit');

  });
  it('should be created', () => {
    expect(directiveEl).not.toBeNull();
  });

  describe('onIonChange', () => {
    it('should emit onCharacterCountChanged if '
            + 'charLimit is true and e.value is not undefined', () => {
      directiveInstance['charLimit'] = 3;
      directiveInstance.onIonChange({ value: '11' });
      expect(directiveInstance.onCharacterCountChanged.emit).toHaveBeenCalledWith(1);
    });
    it('should return undefined if charLimit is false and e.value is not undefined', () => {
      directiveInstance['charLimit'] = null;
      directiveInstance.onIonChange({ value: '11' });
      expect(directiveInstance.onCharacterCountChanged.emit).not.toHaveBeenCalled();
    });
    it('should return undefined if charLimit is true and e.value is undefined', () => {
      directiveInstance['charLimit'] = 3;
      directiveInstance.onIonChange({ value: undefined });
      expect(directiveInstance.onCharacterCountChanged.emit).not.toHaveBeenCalled();
    });
  });

  describe('onInput', () => {
    it('should emit onCharacterCountChanged if '
            + 'charLimit is true and e.target.value is not undefined', () => {
      directiveInstance['charLimit'] = 3;
      directiveInstance.onInput({ target: { value: '11' } });
      expect(directiveInstance.onCharacterCountChanged.emit).toHaveBeenCalledWith(1);
    });
    it('should return undefined if charLimit is false and e.target.value is not undefined', () => {
      directiveInstance['charLimit'] = null;
      directiveInstance.onInput({ target: { value: '11' } });
      expect(directiveInstance.onCharacterCountChanged.emit).not.toHaveBeenCalled();
    });
    it('should return undefined if charLimit is true and e.target.value is undefined', () => {
      directiveInstance['charLimit'] = 3;
      directiveInstance.onInput({ target: { value: undefined } });
      expect(directiveInstance.onCharacterCountChanged.emit).not.toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    it('should emit onCharacterCountChanged if charLimit is true', () => {
      directiveInstance['charLimit'] = 3;
      directiveInstance.el.nativeElement.value = '11';
      directiveInstance.ngAfterViewInit();
      expect(directiveInstance.onCharacterCountChanged.emit).toHaveBeenCalledWith(1);
    });
  });
});

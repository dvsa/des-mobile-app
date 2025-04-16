import { Component, DebugElement, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CharacterCountDirective } from '@directives/character-count.directive';

@Component({
    template: '<input type="text" charCount>',
    standalone: false
})
class TestCharCountComponent {}

class ElementRefMock extends ElementRef {
  nativeElement = {
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
      declarations: [TestCharCountComponent, CharacterCountDirective],
      providers: [{ provide: ElementRef, useValue: ElementRefMock }],
    });
    fixture = TestBed.createComponent(TestCharCountComponent);
    directiveEl = fixture.debugElement.query(By.directive(CharacterCountDirective));
    directiveInstance = directiveEl.injector.get(CharacterCountDirective);
    spyOn(directiveInstance.onCharacterCountChanged, 'emit');
  });
  it('should be created', () => {
    expect(directiveEl).not.toBeNull();
  });

  describe('ngAfterViewInit', () => {
    it('should emit onCharacterCountChanged if charLimit is true', () => {
      directiveInstance.charLimit = 3;
      directiveInstance.el.nativeElement.value = '11';
      directiveInstance.ngAfterViewInit();
      expect(directiveInstance.onCharacterCountChanged.emit).toHaveBeenCalledWith(1);
    });
  });

  describe('onInput', () => {
    it('should call handleChange with the correct value', () => {
      spyOn(directiveInstance, 'handleChange');
      directiveInstance.onInput({ target: { value: 'hello' } });
      expect(directiveInstance.handleChange).toHaveBeenCalledWith('hello');
    });
  });

  describe('onIonChange', () => {
    it('should call handleChange with the correct value', () => {
      spyOn(directiveInstance, 'handleChange');
      directiveInstance.onIonChange({ target: { value: 'hello' } });
      expect(directiveInstance.handleChange).toHaveBeenCalledWith('hello');
    });
  });

  describe('handleChange', () => {
    it('should emit remaining character count when charLimit is set and value is provided', () => {
      directiveInstance.charLimit = 10;
      directiveInstance.handleChange('hello');
      expect(directiveInstance.onCharacterCountChanged.emit).toHaveBeenCalledWith(5);
    });

    it('should not emit when charLimit is not set', () => {
      directiveInstance.charLimit = null;
      directiveInstance.handleChange('hello');
      expect(directiveInstance.onCharacterCountChanged.emit).not.toHaveBeenCalled();
    });

    it('should not emit when value is undefined', () => {
      directiveInstance.charLimit = 10;
      directiveInstance.handleChange(undefined);
      expect(directiveInstance.onCharacterCountChanged.emit).not.toHaveBeenCalled();
    });

    it('should emit remaining character count when input is empty string', () => {
      directiveInstance.charLimit = 10;
      directiveInstance.handleChange('');
      expect(directiveInstance.onCharacterCountChanged.emit).toHaveBeenCalledWith(10);
    });

    it('should emit remaining character count when input is null', () => {
      directiveInstance.charLimit = 10;
      directiveInstance.handleChange(null);
      expect(directiveInstance.onCharacterCountChanged.emit).toHaveBeenCalledWith(10);
    });
  });

  describe('getUtf8ByteLength', () => {
    it('should return correct byte length for ASCII characters', () => {
      const result = directiveInstance.getUtf8ByteLength('hello');
      expect(result).toBe(5);
    });

    it('should return correct byte length for multi-byte characters', () => {
      const result = directiveInstance.getUtf8ByteLength('你好');
      expect(result).toBe(6);
    });

    it('should return 0 for an empty string', () => {
      const result = directiveInstance.getUtf8ByteLength('');
      expect(result).toBe(0);
    });

    it('should return correct byte length for mixed characters', () => {
      const result = directiveInstance.getUtf8ByteLength('hello你好');
      expect(result).toBe(11);
    });

    it('returns correct byte length for special characters', () => {
      const result = directiveInstance.getUtf8ByteLength('!@#$%^&*()');
      expect(result).toBe(10);
    });
  });
});

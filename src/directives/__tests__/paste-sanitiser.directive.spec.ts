import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, ElementRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PasteSanitiserDirective } from '@directives/paste-sanitiser';

@Component({
  template: '<input pasteSanitiser>',
})
class TestComponent { }

describe('PasteSanitiserDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasteSanitiserDirective, TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    inputElement = fixture.debugElement.query(By.directive(PasteSanitiserDirective));
  });

  it('should create an instance', () => {
    const directive = new PasteSanitiserDirective(inputElement.injector.get(ElementRef));
    expect(directive).toBeTruthy();
  });

  it('should limit input length based on maxLength attribute', () => {
    inputElement.nativeElement.setAttribute('maxLength', '5');
    fixture.detectChanges();

    inputElement.nativeElement.value = '123456';
    inputElement.triggerEventHandler('paste', { clipboardData: { getData: () => '1234567890' } });
    fixture.detectChanges();

    expect(inputElement.nativeElement.value).toBe('12345');
  });

  it('should limit input length based on charLimit attribute', () => {
    inputElement.nativeElement.setAttribute('charLimit', '3');
    fixture.detectChanges();

    inputElement.nativeElement.value = 'abcde';
    inputElement.triggerEventHandler('paste', { clipboardData: { getData: () => 'abcdef' } });
    fixture.detectChanges();

    expect(inputElement.nativeElement.value).toBe('abc');
  });

  it('should not limit input length if neither maxLength nor charLimit attribute is set', () => {
    fixture.detectChanges();

    inputElement.nativeElement.value = '123456';
    inputElement.triggerEventHandler('paste', { clipboardData: { getData: () => '123456' } });
    fixture.detectChanges();

    expect(inputElement.nativeElement.value).toBe('123456');
  });
});

import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, ElementRef, NgZone } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PasteSanitiserDirective } from '@directives/paste-sanitiser';

@Component({
  template: '<input pasteSanitiser>',
})
class TestComponent {}

fdescribe('PasteSanitiserDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputElement: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PasteSanitiserDirective, TestComponent],
      providers: [NgZone],
    });
    fixture = TestBed.createComponent(TestComponent);
    inputElement = fixture.debugElement.query(By.directive(PasteSanitiserDirective));
  }));

  it('should create an instance', inject([ElementRef, NgZone], (elementRef: ElementRef, ngZone: NgZone) => {
    const directive = new PasteSanitiserDirective(elementRef, ngZone);
    expect(directive).toBeTruthy();
  }));

  it('should limit input length based on maxLength attribute', waitForAsync(() => {
    inputElement.nativeElement.setAttribute('maxLength', '5');

    inputElement.nativeElement.value = '123456';
    inputElement.triggerEventHandler('paste', { clipboardData: { getData: () => '1234567890' } });

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(inputElement.nativeElement.value).toBe('12345');
    });
  }));

  xit('should limit input length based on charLimit attribute', () => {
    inputElement.nativeElement.setAttribute('charLimit', '3');

    inputElement.nativeElement.value = 'abcde';
    inputElement.triggerEventHandler('paste', { clipboardData: { getData: () => 'abcdef' } });
    fixture.detectChanges();

    expect(inputElement.nativeElement.value).toBe('abc');
  });

  xit('should not limit input length if neither maxLength nor charLimit attribute is set', () => {
    inputElement.nativeElement.value = '123456';
    inputElement.triggerEventHandler('paste', { clipboardData: { getData: () => '123456' } });
    fixture.detectChanges();

    expect(inputElement.nativeElement.value).toBe('123456');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, ElementRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { EmojiBlockDirective } from '@directives/emoji-block.directive';

@Component({
  template: '<input emojiBlock>',
})
class TestComponent { }

describe('EmojiBlockDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmojiBlockDirective, TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    inputElement = fixture.debugElement.query(By.directive(EmojiBlockDirective));
  });

  it('should create an instance', () => {
    const directive = new EmojiBlockDirective(inputElement.injector.get(ElementRef));
    expect(directive).toBeTruthy();
  });

  it('should remove emojis from input on input event', () => {
    fixture.detectChanges();

    inputElement.nativeElement.value = 'Hello 😀 World 🌎';
    inputElement.triggerEventHandler('input', {});
    fixture.detectChanges();

    expect(inputElement.nativeElement.value).toBe('Hello  World ');
  });

  it('should remove emojis from input on paste event', () => {
    fixture.detectChanges();

    inputElement.nativeElement.value = 'Hello 😀 World 🌎';
    inputElement.triggerEventHandler('paste', {});
    fixture.detectChanges();

    expect(inputElement.nativeElement.value).toBe('Hello  World ');
  });
});

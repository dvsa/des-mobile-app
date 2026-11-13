import { ElementRef } from '@angular/core';
import { EmojiBlockDirective } from '@directives/emoji-block.directive';
import { type MockedObject, beforeEach, describe, expect, it, vi } from 'vitest';

describe('EmojiBlockDirective', () => {
  let directive: EmojiBlockDirective;
  let elementRefMock: MockedObject<ElementRef>;

  beforeEach(() => {
    elementRefMock = {
      nativeElement: {
        value: 'Hello😀 World🌎',
        setAttribute: vi.fn(),
        getAttribute: vi.fn(),
        hasAttribute: vi.fn(),
      },
    };
    directive = new EmojiBlockDirective(elementRefMock as ElementRef);
  });

  it('should not modify value if inputField is null', () => {
    elementRefMock.nativeElement = null;
    directive.onInput();
    expect(elementRefMock.nativeElement).toBeNull();
  });

  it('should not modify value if inputField value is empty', () => {
    elementRefMock.nativeElement.value = '';
    directive.onInput();
    expect(elementRefMock.nativeElement.value).toBe('');
  });

  it('should remove emojis from inputField value', () => {
    elementRefMock.nativeElement.value = 'Hello😀 World🌎';
    directive.onInput();
    expect(elementRefMock.nativeElement.value).toBe('Hello World');
  });

  it('should not modify value if there are no emojis', () => {
    elementRefMock.nativeElement.value = 'Hello World';
    directive.onInput();
    expect(elementRefMock.nativeElement.value).toBe('Hello World');
  });
});

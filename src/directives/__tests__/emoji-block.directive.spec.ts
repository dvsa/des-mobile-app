import { ElementRef } from '@angular/core';
import { EmojiBlockDirective } from '@directives/emoji-block.directive';

describe('EmojiBlockDirective', () => {
  let directive: EmojiBlockDirective;
  let elementRefMock: jasmine.SpyObj<ElementRef>;

  beforeEach(() => {
    elementRefMock = {
      nativeElement: {
        value: 'Hello😀 World🌎',
        setAttribute: jasmine.createSpy(),
        getAttribute: jasmine.createSpy(),
        hasAttribute: jasmine.createSpy(),
      },
    };
    directive = new EmojiBlockDirective(elementRefMock as ElementRef);
  });

  it('should sanitize emojis from input data', () => {
    directive.onInput();

    expect(elementRefMock.nativeElement.value)
      .toBe('Hello World');
  });
});

import { ElementRef } from '@angular/core';
import { PasteSanitiserDirective } from '@directives/paste-sanitiser';

describe('PasteSanitiserDirective', () => {
  let directive: PasteSanitiserDirective;
  let elementRefMock: jasmine.SpyObj<ElementRef>;

  beforeEach(() => {
    elementRefMock = {
      nativeElement: {
        value: '',
        setAttribute: jasmine.createSpy(),
        getAttribute: jasmine.createSpy(),
        hasAttribute: jasmine.createSpy(),
      },
    };
    directive = new PasteSanitiserDirective(elementRefMock as ElementRef);
  });

  it('should sanitize pasted data', () => {
    const event = new ClipboardEvent('paste', {
      clipboardData: new DataTransfer(),
    });
    const maxLength = '5';
    elementRefMock.nativeElement.getAttribute.and.returnValue(maxLength);
    event.clipboardData.setData('text', 'text😊123');
    elementRefMock.nativeElement.hasAttribute.and.returnValue(false);
    spyOn(window, 'setTimeout')
      .and // @ts-ignore
      .callFake((fn) => fn());

    directive.onInput(event);

    expect(elementRefMock.nativeElement.value).toBe('text1');
  });
});

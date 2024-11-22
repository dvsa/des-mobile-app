import { ElementRef } from '@angular/core';
import { PasteSanitiserDirective } from '@directives/paste-sanitiser';

describe('PasteSanitiserDirective', () => {
  let directive: PasteSanitiserDirective;
  let elementRefMock: jasmine.SpyObj<ElementRef>;

  beforeEach(() => {
    elementRefMock = { nativeElement: document.createElement('input') };
    directive = new PasteSanitiserDirective(elementRefMock as ElementRef);
  });

  it('should sanitize pasted data by removing non-numeric characters when numbersOnly is true', (done) => {
    elementRefMock.nativeElement.setAttribute('numbersOnly', 'true');
    elementRefMock.nativeElement.value = '123abc456';
    directive.onInput();

    setTimeout(() => {
      expect(elementRefMock.nativeElement.value).toBe('123456');
      done();
    });
  });

  it('should strip emojis from pasted data', (done) => {
    elementRefMock.nativeElement.value = 'Hello 😊 World';
    directive.onInput();

    setTimeout(() => {
      expect(elementRefMock.nativeElement.value).toBe('Hello  World');
      done();
    });
  });

  it('should truncate pasted data to maxLength', (done) => {
    elementRefMock.nativeElement.setAttribute('maxLength', '5');
    elementRefMock.nativeElement.value = '1234567890';
    directive.onInput();

    setTimeout(() => {
      expect(elementRefMock.nativeElement.value).toBe('12345');
      done();
    });
  });

  it('should handle empty pasted data gracefully', (done) => {
    elementRefMock.nativeElement.value = '';
    directive.onInput();

    setTimeout(() => {
      expect(elementRefMock.nativeElement.value).toBe('');
      done();
    });
  });
});

import { ElementRef, EventEmitter, Renderer2 } from '@angular/core';
import { SetLanguageDirective } from '@directives/set-language.directive';
import { TranslateService } from '@ngx-translate/core';
import { LangChangeEvent } from '@ngx-translate/core/lib/translate.service';
import { TranslateStore } from '@ngx-translate/core/dist/lib/translate.store';
import SpyObj = jasmine.SpyObj;
import { Observable, of } from 'rxjs';

describe('LanguageSetDirective', () => {
  let directive: SetLanguageDirective;
  let elementRefMock: jasmine.SpyObj<ElementRef>;
  let translateMock: jasmine.SpyObj<TranslateService>;
  let renderMock: jasmine.SpyObj<Renderer2>;

  beforeEach(() => {
    elementRefMock = {
      nativeElement: {
        value: '',
        setAttribute: jasmine.createSpy(),
        getAttribute: jasmine.createSpy(),
        hasAttribute: jasmine.createSpy(),
      },
    };
    renderMock = {
      removeAttribute: jasmine.createSpy(),
      setAttribute: jasmine.createSpy(),
    } as SpyObj<Renderer2>;
    translateMock = {
      use(lang: string): Observable<any> {
        translateMock.store.onLangChange.emit({
          lang: lang,
          translations: null,
        });
        return of(null);
      },
      store: {
        onLangChange: new EventEmitter<LangChangeEvent>(),
      } as TranslateStore,
    } as SpyObj<TranslateService>;
    directive = new SetLanguageDirective(elementRefMock as ElementRef, translateMock, renderMock);
  });

  it('should add lang attribute with value of cy if the value of onLangChange is cy', () => {
    directive.ngOnInit();
    translateMock.use('cy');

    expect(renderMock.setAttribute)
      .toHaveBeenCalledWith(elementRefMock.nativeElement,'lang', 'cy');
  });
  it('should delete lang attribute if the value of onLangChange is not cy', () => {
    directive.ngOnInit();
    translateMock.use('test');

    expect(renderMock.removeAttribute)
      .toHaveBeenCalledWith(elementRefMock.nativeElement,'lang');
  });
  it('should not interact with attribute if the value of onLangChange does not have a lang variable', () => {
    directive.ngOnInit();
    translateMock.store.onLangChange.emit({translations: null} as LangChangeEvent)

    expect(renderMock.setAttribute).not
      .toHaveBeenCalled();
    expect(renderMock.removeAttribute).not
      .toHaveBeenCalled();
  });
});

import { ElementRef, Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AddOrRemoveLangCyDirective } from '../add-or-remove-lang-cy.directive';

class MockTranslateService {
  current = 'en';
  onLangChange = new Subject<{
    lang: string;
  }>();
  getCurrentLang() {
    return this.current;
  }
}

describe('AddOrRemoveLangCyDirective', () => {
  let translateService: MockTranslateService;
  let renderer: Renderer2;
  let nativeElement: any;
  let elementRef: ElementRef;
  let directive: AddOrRemoveLangCyDirective;

  beforeEach(() => {
    translateService = new MockTranslateService();
    renderer = TestBed.inject(RendererFactory2).createRenderer(null, null);
    vi.spyOn(renderer, 'setAttribute').mockReturnValue(undefined);
    vi.spyOn(renderer, 'removeAttribute').mockReturnValue(undefined);
  });

  it('sets lang="cy" on init when current language is "cy"', () => {
    nativeElement = { hasAttribute: () => false };
    elementRef = new ElementRef(nativeElement);
    translateService.current = 'cy';

    directive = new AddOrRemoveLangCyDirective(elementRef, translateService as any, renderer);
    directive.ngOnInit();

    expect(renderer.setAttribute).toHaveBeenCalledWith(nativeElement, 'lang', 'cy');
  });

  it('removes lang attribute on init when current language is not "cy" and element has lang', () => {
    nativeElement = { hasAttribute: () => true };
    elementRef = new ElementRef(nativeElement);
    translateService.current = 'en';

    directive = new AddOrRemoveLangCyDirective(elementRef, translateService as any, renderer);
    directive.ngOnInit();

    expect(renderer.removeAttribute).toHaveBeenCalledWith(nativeElement, 'lang');
  });

  it('updates lang attribute when onLangChange emits to "cy" then removes when emits non-"cy"', () => {
    nativeElement = { hasAttribute: () => true };
    elementRef = new ElementRef(nativeElement);
    translateService.current = 'en';

    directive = new AddOrRemoveLangCyDirective(elementRef, translateService as any, renderer);
    directive.ngOnInit();

    // emit cy -> should set attribute
    translateService.onLangChange.next({ lang: 'cy' });
    expect(renderer.setAttribute).toHaveBeenCalledWith(nativeElement, 'lang', 'cy');

    // emit en -> should remove attribute
    translateService.onLangChange.next({ lang: 'en' });
    expect(renderer.removeAttribute).toHaveBeenCalledWith(nativeElement, 'lang');
  });

  it('does not subscribe or modify attributes when shouldListenToLanguageChanges is false', () => {
    nativeElement = { hasAttribute: () => true };
    elementRef = new ElementRef(nativeElement);
    translateService.current = 'cy';

    directive = new AddOrRemoveLangCyDirective(elementRef, translateService as any, renderer);
    directive.shouldListenToLanguageChanges = false;
    directive.ngOnInit();

    expect(renderer.setAttribute).not.toHaveBeenCalled();
    expect(renderer.removeAttribute).not.toHaveBeenCalled();

    // emitting should have no effect
    translateService.onLangChange.next({ lang: 'cy' });
    expect(renderer.setAttribute).not.toHaveBeenCalled();
  });

  it('safely handles nativeElement without hasAttribute and does nothing', () => {
    nativeElement = {}; // no hasAttribute
    elementRef = new ElementRef(nativeElement);
    translateService.current = 'cy';

    directive = new AddOrRemoveLangCyDirective(elementRef, translateService as any, renderer);
    // should not throw
    expect(() => directive.ngOnInit()).not.toThrow();
    expect(renderer.setAttribute).not.toHaveBeenCalled();
    expect(renderer.removeAttribute).not.toHaveBeenCalled();
  });

  it('unsubscribes from language changes on destroy', () => {
    nativeElement = { hasAttribute: () => false };
    elementRef = new ElementRef(nativeElement);
    translateService.current = 'en';

    directive = new AddOrRemoveLangCyDirective(elementRef, translateService as any, renderer);
    directive.ngOnInit();

    // ensure listener is set
    expect((directive as any).listener).not.toBeNull();

    const unsubscribeSpy = vi.spyOn((directive as any).listener, 'unsubscribe');
    directive.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
    expect((directive as any).listener).toBeNull();
  });
});

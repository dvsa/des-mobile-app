import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[addOrRemoveLangCy]',
  standalone: false,
})
export class AddOrRemoveLangCyDirective implements OnInit, OnDestroy {
  @Input()
  shouldListenToLanguageChanges = true;

  listener: Subscription = null;

  constructor(
    private ref: ElementRef,
    private translateService: TranslateService,
    private renderer: Renderer2
  ) {}

  /**
   * Assigns or removes the 'lang' attribute on the element based on the provided language.
   *
   * @param {string} language - The language code to assign. If 'cy', the 'lang' attribute is set to 'cy'.
   *                            If any other value, the 'lang' attribute is removed if it exists.
   */
  assignLanguage(language: string) {
    if (
      !!language &&
      'hasAttribute' in this.ref.nativeElement &&
      'setAttribute' in this.renderer &&
      'removeAttribute' in this.renderer
    ) {
      if (language === 'cy') {
        this.renderer.setAttribute(this.ref.nativeElement, 'lang', 'cy');
      } else if (this.ref.nativeElement.hasAttribute('lang')) {
        this.renderer.removeAttribute(this.ref.nativeElement, 'lang');
      }
    }
  }

  ngOnDestroy() {
    if (this.listener) {
      this.listener.unsubscribe();
      this.listener = null;
    }
  }

  /**
   * Initializes the directive. Assigns the current language to the element and sets up a listener
   * to update the language attribute when the language changes.
   **/
  ngOnInit() {
    if (this.shouldListenToLanguageChanges) {
      this.assignLanguage(this.translateService.store.currentLang);
      this.listener = this.translateService.store.onLangChange.subscribe((value) => {
        this.assignLanguage(value.lang);
      });
    }
  }
}

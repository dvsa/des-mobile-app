import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Directive({
  selector: '[addOrRemoveLangCy]',
})
export class AddOrRemoveLangCyDirective {

  constructor(
    private ref: ElementRef,
    private translateService: TranslateService,
    private renderer: Renderer2,
  ) {
  }

  assignLanguage(language: string) {
    if (
      !!language &&
      ('hasAttribute' in this.ref.nativeElement) &&
      ('setAttribute' in this.renderer) &&
      ('removeAttribute' in this.renderer)
    ) {
      if (language === 'cy') {
        this.renderer.setAttribute(this.ref.nativeElement, 'lang', 'cy');
      } else if (this.ref.nativeElement.hasAttribute('lang')) {
        this.renderer.removeAttribute(this.ref.nativeElement, 'lang');
      }
    }
  }

  ngOnInit() {
    this.assignLanguage(this.translateService.store.currentLang);
    this.translateService.store.onLangChange.subscribe((value) => {
      console.log('subscribeLang', value.lang);
      this.assignLanguage(value.lang);
    });
  }
}

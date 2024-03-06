import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Directive({
  selector: '[setLanguage]',
})
export class LanguageSetDirective {

  constructor (
    private ref: ElementRef,
    private translateService: TranslateService,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    this.translateService.store.onLangChange.subscribe( (value) => {
      if (value.lang) {
        if (value.lang === 'cy') {
          this.renderer.setAttribute(this.ref.nativeElement, 'lang', 'cy');
        } else {
          this.renderer.removeAttribute(this.ref.nativeElement, 'lang');
        }
      }
    });
  }
}

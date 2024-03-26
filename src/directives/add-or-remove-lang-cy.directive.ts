import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Directive({
  selector: '[addOrRemoveLangCy]',
})
export class AddOrRemoveLangCyDirective {

  constructor (
    private ref: ElementRef,
    private translateService: TranslateService,
    private renderer: Renderer2,
  ) {}

  assignLanguage(language: string) {
    if (language) {
      if (language === 'cy') {
        this.renderer.setAttribute(this.ref.nativeElement, 'lang', 'cy');
      } else {
        this.renderer.removeAttribute(this.ref.nativeElement, 'lang');
      }
    }
  }

  ngOnInit() {
    if(this.translateService.store.currentLang) {
      this.assignLanguage(this.translateService.store.currentLang)
    }
    this.translateService.store.onLangChange.subscribe( (value) => {
      this.assignLanguage(value.lang)
    });
  }
}

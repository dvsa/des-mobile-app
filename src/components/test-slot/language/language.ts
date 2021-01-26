import { Component, Input } from '@angular/core';

@Component({
  selector: 'language',
  templateUrl: 'language.html',
})
export class LanguageComponent {

  @Input()
  welshLanguage: boolean;

}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'language',
  templateUrl: 'language.html',
  styleUrls: ['language.scss'],
  standalone: false,
})
export class LanguageComponent {
  @Input()
  welshLanguage: boolean;

  @Input()
  applicationId: string;
}

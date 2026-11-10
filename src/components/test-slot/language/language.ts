import { Component, Input } from '@angular/core';
import { IonText } from '@ionic/angular';

@Component({
  selector: 'language',
  templateUrl: 'language.html',
  styleUrls: ['language.scss'],
  imports: [IonText],
})
export class LanguageComponent {
  @Input()
  welshLanguage: boolean;

  @Input()
  applicationId: string;
}

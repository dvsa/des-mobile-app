import { Component, Input } from '@angular/core';
import { IonCol, IonRow, IonText } from '@ionic/angular';

@Component({
  selector: 'alternate-mot-evidence-provided',
  templateUrl: './alternate-mot-evidence-provided.component.html',
  styleUrls: ['./alternate-mot-evidence-provided.component.scss'],
  imports: [IonRow, IonCol, IonText],
})
export class AlternateEvidenceProvidedComponent {
  @Input()
  shouldHaveSeparator = false;

  @Input()
  alternativeEvidenceProvided = false;
}

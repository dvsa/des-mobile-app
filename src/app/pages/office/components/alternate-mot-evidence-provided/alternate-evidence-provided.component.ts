import { Component, Input } from '@angular/core';

@Component({
  selector: 'alternate-mot-evidence-provided',
  templateUrl: './alternate-mot-evidence-provided.component.html',
  styleUrls: ['./alternate-mot-evidence-provided.component.scss'],
})
export class AlternateEvidenceProvidedComponent {

  @Input()
  shouldHaveSeparator = false;

  @Input()
  alternativeEvidenceProvided = false;
}

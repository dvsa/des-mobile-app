import { Component, Input } from '@angular/core';

@Component({
  selector: 'finalisation-header',
  templateUrl: 'finalisation-header.html',
})
export class FinalisationHeaderComponent {

  @Input()
  candidateName: string;

  @Input()
  candidateDriverNumber: string;

  @Input()
  outcomeText: string;
}

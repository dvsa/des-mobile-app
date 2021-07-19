import { Component, Input } from '@angular/core';

@Component({
  selector: 'finalisation-header',
  templateUrl: './finalisation-header.html',
  styleUrls: ['./finalisation-header.scss'],
})
export class FinalisationHeaderComponent {

  @Input()
  candidateName: string;

  @Input()
  candidateDriverNumber: string;

  @Input()
  outcomeText: string;
}

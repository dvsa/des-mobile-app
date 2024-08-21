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
  candidatePrnNumber: number;

  @Input()
  isStandardsCheck: boolean;

  @Input()
  outcomeText: string;

  @Input()
  grade: string;
}

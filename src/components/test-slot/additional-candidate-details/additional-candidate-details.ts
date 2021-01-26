import { Component, Input } from '@angular/core';

@Component({
  selector: 'additional-candidate-details',
  templateUrl: 'additional-candidate-details.html',
})
export class AdditionalCandidateDetailsComponent {
  @Input()
  prn: number;

  @Input()
  attempts: number;
}

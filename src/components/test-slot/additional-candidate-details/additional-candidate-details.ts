import { Component, Input } from '@angular/core';

@Component({
  selector: 'additional-candidate-details',
  templateUrl: 'additional-candidate-details.html',
  styleUrls: ['additional-candidate-details.scss'],
})
export class AdditionalCandidateDetailsComponent {
  @Input()
  prn: number;

  @Input()
  attempts: number;
}

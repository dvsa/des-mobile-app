import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'candidate-detail-navigation',
  templateUrl: 'candidate-detail-navigation.html',
  styleUrls: ['candidate-detail-navigation.scss'],
})
export class CandidateDetailNavigationComponent {
  @Input()
  name: string;
  @Input()
  date: string;
  @Input()
  time: string;
  @Input()
  canNavigateToPreviousCandidate: boolean;
  @Input()
  canNavigateToNextCandidate: boolean;

  @Output()
  previousCandidateClicked = new EventEmitter();
  @Output()
  nextCandidateClicked = new EventEmitter();

  onPreviousCandidateClick(): void {
    this.previousCandidateClicked.emit();
  }

  onNextCandidateClick(): void {
    this.nextCandidateClicked.emit();
  }
}

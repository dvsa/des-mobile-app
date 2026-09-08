import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DateTime } from '@shared/helpers/date-time';

@Component({
  selector: 'candidate-detail-navigation',
  templateUrl: 'candidate-detail-navigation.html',
  styleUrls: ['candidate-detail-navigation.scss'],
  standalone: false,
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

  isToday(): boolean {
    return DateTime.at(this.date).format('YYYY-MM-DD') === new DateTime().format('YYYY-MM-DD');
  }

  onPreviousCandidateClick(): void {
    this.previousCandidateClicked.emit();
  }

  onNextCandidateClick(): void {
    this.nextCandidateClicked.emit();
  }
}

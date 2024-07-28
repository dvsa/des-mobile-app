import { Component, Input } from '@angular/core';

@Component({
  selector: 'modal-result-item',
  templateUrl: 'modal-result-item.html',
  styleUrls: ['modal-result-item.scss'],
})
export class ModalResultItemComponent {
  @Input()
  label: string;

  @Input()
  testState?: number;

  @Input()
  score: number;

  @Input()
  adi3 = false;

  @Input()
  showScore = true;

  @Input()
  showIcon = true;

  @Input()
  isPass: boolean;

  @Input()
  idSelector: string;

  getOutcomeIcon(): string {
    const passImage = 'assets/imgs/greenCorrectAnswer.png';
    const failImage = 'assets/imgs/redWrongAnswer.png';
    return this.isPass ? passImage : failImage;
  }

  displayScore(score: number): string {
    const finalScore = score || 0;
    return this.adi3 ? (score || this.testState > 0 ? score : '-').toString() : `${finalScore}%`;
  }
}

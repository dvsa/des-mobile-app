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
  score: number;

  @Input()
  isPass: boolean;

  getOutcomeIcon(): string {
    const passImage = 'assets/imgs/greenCorrectAnswer.png';
    const failImage = 'assets/imgs/redWrongAnswer.png';
    return (this.isPass ? passImage : failImage);
  }

  displayScore(score: number): number {
    return score || 0;
  }

}

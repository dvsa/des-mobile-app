import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'examiner-records-label-text',
  templateUrl: 'examiner-records-label-text.html',
  styleUrls: ['examiner-records-label-text.scss'],
  standalone: false,
})
export class ExaminerRecordsLabelTextComponent {
  @Input() testCount: number;
  @Input() currentCategory: string;
  @Input() startDateFilter: string;
  @Input() endDateFilter: string;
  @Input() centreName: string;

  @Output()
  showLearnMoreModal = new EventEmitter();

  onShowLearnMoreModal(): void {
    this.showLearnMoreModal.emit();
  }
}

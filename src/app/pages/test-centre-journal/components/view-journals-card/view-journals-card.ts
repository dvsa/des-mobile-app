import {
  Component,
  Input,
} from '@angular/core';
import { ExaminerWorkSchedule } from '@dvsa/mes-journal-schema';
import { TestCentreDetailResponse } from '../../../../shared/models/test-centre-journal.model';

@Component({
  selector: 'view-journals-card',
  templateUrl: 'view-journals-card.html',
  styleUrls: ['./view-journals-card.scss'],
})
export class ViewJournalsCardComponent {

  @Input()
  testCentreResults: TestCentreDetailResponse;

  journal: ExaminerWorkSchedule | null = null;

  get interfaceOptions() {
    return {
      cssClass: 'mes-select',
      enableBackdropDismiss: false,
      placeholder: 'Select examiner',
      okText: 'Select',
      cancelText: 'Cancel',
    };
  }

  examinerChanged = (staffNumber: string): void => {
    const { journal } = this.testCentreResults?.examiners.find((examiner) => examiner.staffNumber === staffNumber);
    this.journal = journal;
  };

  onShowJournalClick = (): void => {
    // createSlots with this.journal
    console.log(this.journal);
  };

}

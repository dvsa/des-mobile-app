import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'question-footer',
  templateUrl: 'question-footer.html',
})
export class QuestionFooterComponent {

  @Output()
  questionPageChange = new EventEmitter();

  @Output()
  testSummaryRequested = new EventEmitter<boolean>();

  @Input()
  questionNumber: number;

  @Input()
  formGroup: FormGroup;

  @Input()
  isDelegated?: boolean = false;

  constructor(
    public toastController: ToastController,
  ) {
  }

  showPreviousPageButton = (): boolean => this.questionNumber > 1 && !this.isDelegated;

  showNextPageButton = (): boolean => this.questionNumber < 5 && !this.isDelegated;

  showViewSummaryButton = (): boolean => this.questionNumber === 5 || this.isDelegated;

  goToPreviousQuestion = (): void => {
    const questionNumber: number = this.questionNumber - 1;
    this.questionPageChange.emit(questionNumber);
  };

  goToNextQuestion = () => {
    const questionNumber: number = this.questionNumber + 1;
    this.questionPageChange.emit(questionNumber);
  };

  goToSummary = async () => {
    if (this.isDelegated) {
      if (await this.isFormValid()) {
        this.testSummaryRequested.emit(true);
      }
      return;
    }
    this.testSummaryRequested.emit(true);
  };

  async isFormValid() {
    Object.keys(this.formGroup.controls).forEach((controlName) => this.formGroup.controls[controlName].markAsDirty());
    if (this.formGroup.valid) {
      return true;
    }

    const toast = await this.createToast('Please select all scores');
    await toast.present();
    return false;
  }

  private createToast = (errorMessage: string) => {
    return this.toastController.create({
      message: errorMessage,
      position: 'top',
      cssClass: 'mes-toast-message-error',
      duration: 5000,
      buttons: [{ text: 'X', role: 'cancel' }],
    });
  };

}

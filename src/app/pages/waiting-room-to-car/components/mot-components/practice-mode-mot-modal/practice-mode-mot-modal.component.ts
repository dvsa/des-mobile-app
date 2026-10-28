import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IonButton, IonCol, IonRow, ModalController } from '@ionic/angular';
import { ModalEvent } from '@pages/journal/components/journal-force-check-modal/journal-force-check-modal.constants';
import { ModalAlertTitleComponent } from '../../../../../../components/common/modal-alert-title/modal-alert-title';

export enum PracticeModeMOTType {
  FAILED = 'fail',
  PASS = 'pass',
  NO_DETAILS = 'no details',
}

@Component({
  selector: 'practice-mode-mot-modal',
  templateUrl: './practice-mode-mot-modal.component.html',
  styleUrls: ['./practice-mode-mot-modal.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, IonRow, IonCol, ModalAlertTitleComponent, IonButton],
})
export class PracticeModeMOTModal implements OnInit {
  form: UntypedFormGroup = new UntypedFormGroup({});
  formControl: UntypedFormControl;

  constructor(public modalCtrl: ModalController) {}

  ngOnInit(): void {
    if (!this.formControl) {
      this.formControl = new UntypedFormControl('', [Validators.required]);
      this.form.addControl('motPracticeOutcome', this.formControl);
    }
  }

  async onConfirm() {
    this.formControl.markAsDirty();
    if (!this.invalid) {
      await this.modalCtrl.dismiss(this.formControl.value);
    }
  }
  onCancel = async (): Promise<void> => {
    await this.modalCtrl.dismiss(ModalEvent.CANCEL);
  };

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  protected readonly PracticeModeMOTType = PracticeModeMOTType;
}

import {
  ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivityCodeModel } from '@shared/constants/activity-code/activity-code.constants';
import { ModalController } from '@ionic/angular';
import { ModalActivityCodeListComponent } from '@components/common/modal-activity-code-list/modal-activity-code-list';
import { ActivityCodeModalEvent } from '@components/common/activity-code/acitivity-code-modal-event';

@Component({
  selector: 'activity-code',
  templateUrl: 'activity-code.html',
  styleUrls: ['activity-code.scss'],
})
export class ActivityCodeComponent implements OnChanges {

  @Input()
  activityCodeModel: ActivityCodeModel;

  @Input()
  activityCodeOptions: ActivityCodeModel[];

  @Input()
  formGroup: FormGroup;

  @Input()
  disabled: boolean;

  @Input()
  isAdi3: boolean;

  @Output()
  activityCodeChange = new EventEmitter<ActivityCodeModel>();

  private formControl: FormControl;
  static readonly fieldName: string = 'activityCode';

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public modalController: ModalController,
  ) {
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl({ disabled: true }, [Validators.required]);
      this.formGroup.addControl(ActivityCodeComponent.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.activityCodeModel);
  }

  activityCodeChanged(activityCode: ActivityCodeModel): void {
    this.activityCodeChange.emit(activityCode);
  }

  get invalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

  isSelectDisabled(): boolean {
    return this.disabled || (this.activityCodeModel && parseInt(this.activityCodeModel.activityCode, 10) < 4);
  }

  openActivityCodeListModal = async (): Promise<void> => {
    if (this.isSelectDisabled()) {
      return;
    }

    const activityCodeModal: HTMLIonModalElement = await this.modalController.create({
      id: 'ActivityCodeListModal',
      cssClass: this.isAdi3 ? 'adi3-activity-code-modal text-zoom-regular' : 'activity-code-modal text-zoom-regular',
      component: ModalActivityCodeListComponent,
      backdropDismiss: false,
      showBackdrop: true,
      componentProps: {
        activityCodeModel: this.activityCodeModel,
        activityCodeOptions: this.activityCodeOptions,
      },
    });
    await activityCodeModal.present();
    const { data, role } = await activityCodeModal.onWillDismiss();
    await this.onModalDismiss(data, role as ActivityCodeModalEvent);
  };

  onModalDismiss = async (data: ActivityCodeModel | null, event: ActivityCodeModalEvent) => {
    switch (event) {
      case ActivityCodeModalEvent.CANCEL:
        break;
      case ActivityCodeModalEvent.SELECT_CODE:
        this.activityCodeChanged(data);
        break;
      default:
    }
  };

}

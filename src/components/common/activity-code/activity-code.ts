import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import {
  ActivityCodeModel,
} from '@shared/constants/activity-code/activity-code.constants';
import { AlertController, ModalController } from '@ionic/angular';
import { get } from 'lodash';
import { ModalActivityCodeListComponent } from '@components/common/modal-activity-code-list/modal-activity-code-list';

@Component({
  selector: 'activity-code',
  templateUrl: 'activity-code.html',
  styleUrls: ['activity-code.scss'],
})
export class ActivityCodeComponent implements OnChanges, OnInit {

  @Input()
  activityCodeModel: ActivityCodeModel;

  @Input()
  activityCodeOptions: ActivityCodeModel[];

  @Input()
  formGroup: FormGroup;

  @Input()
  disabled: boolean;

  @Output()
  activityCodeChange = new EventEmitter<ActivityCodeModel>();

  private formControl: FormControl;
  static readonly fieldName: string = 'activityCode';
  private static readonly ionSelectOptionClass: string = 'alert-radio-label sc-ion-alert-ios';
  activityCodeListModal: HTMLIonModalElement;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private alertController: AlertController,
    public modalController: ModalController,
  ) {
  }

  ngOnInit(): void {
    this.initialiseSelectClickEvent();
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

  isOptionDisabled(activityCode: ActivityCode): boolean {
    if (parseInt(activityCode, 10) < 4) {
      return true;
    }
    return false;
  }

  initialiseSelectClickEvent(): void {
    // create dom click event
    document.addEventListener('click', async (event) => {
      // check if the element you are clicking has the same class as the ion-select-option
      const isSelectOptionClick: boolean = event['path'][0].className === ActivityCodeComponent.ionSelectOptionClass;

      if (isSelectOptionClick) {
        // obtain text from element
        const activityCodeValue: string = get(event, 'srcElement.innerText', null);

        if (typeof activityCodeValue !== 'string') return;

        this.emitSelection(activityCodeValue);

        await this.dismissSelect();
      }
    });
  }

  private emitSelection = (activityCodeValue: string): void => {
    // split string at every space which should be in format 'activityCode - description'
    const [activityCode, , description] = activityCodeValue.split(' ');

    // dispatch change event with new model
    this.activityCodeChanged({ activityCode, description } as ActivityCodeModel);
  };

  private dismissSelect = async (): Promise<void> => {
  // get a handle on the presented ion-select
    const alert: HTMLIonAlertElement = await this.alertController.getTop();

    // dismiss if present
    if (alert) await alert.dismiss();
  };

  openActivityCodeListModal = async (): Promise<void> => {
    this.activityCodeListModal = await this.modalController.create({
      id: 'ActivityCodeListModal',
      component: ModalActivityCodeListComponent,
      backdropDismiss: false,
      showBackdrop: true,
      componentProps: {
        activityCodeModel: this.activityCodeModel,
        activityCodeOptions: this.activityCodeOptions,
        onCancel: this.onCancel,
        // onReturnToTestReport: this.onReturnToTestReport,
      },
      cssClass: 'activity-code-modal text-zoom-regular',
    });
    await this.activityCodeListModal.present();
  };

  onCancel = async () => {
    console.log('cancel');
    console.log('activityCodeModel', this.activityCodeModel);
    await this.activityCodeListModal.dismiss();
  };

}

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
import { AlertController } from '@ionic/angular';
import { get } from 'lodash';

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

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private alertController: AlertController,
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
    if (this.formControl.valid) {
      this.activityCodeChange.emit(activityCode);
    }
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
      const ionSelectOptionClass = 'alert-radio-label sc-ion-alert-ios';
      // check if the element you are clicking has the same class as the ion-select-option
      const isSelectOptionClick: boolean = event['path'][0].className === ionSelectOptionClass;

      if (isSelectOptionClick) {
        // obtain text from element
        const activityCodeValue: string = get(event, 'srcElement.innerText', null);

        if (typeof activityCodeValue !== 'string') return;

        // split string at every space which should be in format 'code - description'
        const [activityCode, , description] = activityCodeValue.split(' ');

        // construct activity code model
        const activityCodeModel = { activityCode, description } as ActivityCodeModel;

        // dispatch change event with new model
        this.activityCodeChanged(activityCodeModel);

        // get a handle on the presented ion-select
        const alert: HTMLIonAlertElement = await this.alertController.getTop();

        // dismiss if created
        if (alert) {
          await alert.dismiss();
        }
      }
    });
  }
}

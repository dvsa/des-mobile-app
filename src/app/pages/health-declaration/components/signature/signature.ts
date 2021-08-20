import {
  Component, Input, ViewChild, OnInit, OnChanges, Output, EventEmitter,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SignatureAreaComponent } from '@components/common/signature-area/signature-area';

@Component({
  selector: 'signature',
  templateUrl: 'signature.html',
})
export class SignatureComponent implements OnInit, OnChanges {

  @ViewChild(SignatureAreaComponent)
  signatureArea: SignatureAreaComponent;

  @Input()
  signature: string;

  @Input()
  formGroup: FormGroup;

  @Output()
  drawCompleteAction = new EventEmitter<string>();

  @Output()
  clearAction = new EventEmitter();

  formControl: FormControl;
  static readonly fieldName: string = 'signature';

  ngOnInit(): void {
    this.signatureArea.drawCompleteAction = this.drawCompleteAction;
    this.signatureArea.clearAction = this.clearAction;
  }

  ngOnChanges(): void {
    if (!this.formControl) {
      this.formControl = new FormControl('', [Validators.required]);

      this.formGroup.addControl(SignatureComponent.fieldName, this.formControl);
    }
    this.formControl.patchValue(this.signature);
  }

  isInvalid(): boolean {
    return !this.formControl.valid && this.formControl.dirty;
  }

}

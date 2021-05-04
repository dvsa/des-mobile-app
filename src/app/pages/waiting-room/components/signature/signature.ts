import { Component, Input, ViewChild, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SignatureAreaComponent } from '@components/common/signature-area/signature-area';

@Component({
  selector: 'signature',
  templateUrl: 'signature.html',
  styleUrls: ['signature.scss']
})
export class SignatureComponent implements OnChanges {

  @ViewChild(SignatureAreaComponent)
  signatureArea: SignatureAreaComponent;

  @Input()
  signature: string;

  @Input()
  formGroup: FormGroup;

  @Input()
  drawCompleteAction: string ;

  @Input()
  clearAction: string;

  formControl: FormControl;
  static readonly fieldName: string = 'signature';

  initialiseSignature(): void {
    this.signatureArea.initialiseSignatureArea();
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

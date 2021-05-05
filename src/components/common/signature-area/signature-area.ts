/* eslint-disable no-underscore-dangle */
import {
  Component,
  ViewChild,
  forwardRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SignaturePad } from 'angular2-signaturepad';

@Component({
  selector: 'signature-area',
  templateUrl: 'signature-area.html',
  styleUrls: ['signature-area.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SignatureAreaComponent),
      multi: true,
    },
  ],
})
export class SignatureAreaComponent implements ControlValueAccessor {
  @Input()
  public signature: string;

  public isvalid: boolean;
  public retryImage: string;
  public signHereImage: string;
  public drawCompleteAction: string;
  public clearAction: string;
  public actionLess: boolean;

  @ViewChild(SignaturePad, { static: false })
  public signaturePad: SignaturePad;

  @Input()
  public retryButtonText: string;

  @Input()
  public signHereText: string;

  @Input()
  public validationErrorText: string;

  @Input()
  public showValidText: boolean;

  @Output()
  signatureDataChange = new EventEmitter<string>();

  @Output()
  signatureCleared = new EventEmitter();

  constructor() {
    this.signature = null;
    this.isvalid = null;
    this.actionLess = false;
    this.signHereImage = '/assets/imgs/waiting-room/sign-here.png';
    this.retryImage = '/assets/imgs/waiting-room/retry.png';
  }

  public getSignature() {
    return this.signature;
  }

  public setSignature(initialValue: string) {
    this.signaturePad.fromDataURL(initialValue);
    // loading the signature from initial value does not set the internal signature structure, so setting here.
    this.signature = initialValue;
    this.signatureDataChangedDispatch(initialValue);
    this.propagateChange(this.signature);
  }

  ngAfterViewInit() {
    // this.signaturePad.set('minWidth', 1);
    this.signaturePad.clear();
    this.resizeCanvas();
    if (this.signature) {
      this.setSignature(this.signature);
    }
  }

  resizeCanvas(): void {
    // 706 and 250 are the width and height of canvas, can they be deduced dynamically?
    this.signaturePad.queryPad()._canvas.width = 706;
    this.signaturePad.queryPad()._canvas.height = 250;
  }

  clear() {
    this.signaturePad.clear();
    this.signature = null;
    this.signatureDataClearedDispatch();
    this.propagateChange(this.signature);
  }

  drawComplete() {
    this.signature = this.signaturePad.toDataURL('image/svg+xml');
    this.signatureDataChangedDispatch(this.signature);
    this.propagateChange(this.signature);
    this.touchChange(null);
  }

  signatureDataChangedDispatch(signatureData: string): void {
    if (!this.actionLess) {
      this.signatureDataChange.emit(signatureData);
    }
  }

  signatureDataClearedDispatch(): void {
    if (!this.actionLess) {
      this.signatureCleared.emit();
    }
  }

  // we use it to emit changes back to the form
  /* eslint-disable */
  private propagateChange = (_: any) => {};
  private touchChange = (_: any) => {};
  /* eslint-enable */

  public writeValue(value: any) {
    if (value !== undefined) {
      this.signature = value;
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  onTouched() {
    this.touchChange(null);
  }

  registerOnTouched(fn: any) {
    this.touchChange = fn;
  }
}

import {
  Component, ViewChild, forwardRef, Input, ElementRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SignaturePad } from 'angular2-signaturepad';
import { StoreModel } from '@shared/models/store.model';
import { Store } from '@ngrx/store';

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

  @ViewChild(SignaturePad, {static: false}) public signaturePad: SignaturePad;

  @Input()
  public retryButtonText: string;

  @Input()
  public signHereText: string;

  @Input()
  public validationErrorText: string;

  @Input()
  public showValidText: boolean;

  constructor(
    private store$: Store<StoreModel>,
    private elRef: ElementRef,
  ) {
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
    // loading the signature from initial value does not set the internal signature stucture, so setting here.
    this.signature = initialValue;
    this.signatureDataChangedDispatch(initialValue);
    this.propagateChange(this.signature);
  }

  initialiseSignatureArea() {
    // this.signaturePad.set('minWidth', 1); // set szimek/signature_pad options at runtime
    this.canvasResize();
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
    // this.signaturePad.resizeCanvas();
    if (this.signature) {
      this.setSignature(this.signature);
    }
  }

  canvasResize() {
    let canvas = document.querySelector('canvas');
    // const canvas: any = this.elRef.nativeElement.querySelector('canvas');
    this.signaturePad.set('minWidth', 1);
    // this.signaturePad.set('canvasWidth', canvas.offsetWidth);
    // this.signaturePad.set('canvasHeight', canvas.offsetHeight);
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

  signatureDataChangedDispatch(signatureData: string) {
    if (!this.actionLess) {
      this.store$.dispatch({ payload: signatureData, type: this.drawCompleteAction });
    }
  }

  signatureDataClearedDispatch() {
    if (!this.actionLess) {
      this.store$.dispatch({ type: this.clearAction });
    }
  }
  // we use it to emit changes back to the form
  /* eslint-disable */
  private propagateChange = (_: any) => { };
  private touchChange = (_: any) => { };
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

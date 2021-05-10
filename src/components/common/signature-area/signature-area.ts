/* eslint-disable no-underscore-dangle */
import {
  Component,
  ViewChild,
  forwardRef,
  Input,
  Output,
  EventEmitter, ElementRef, AfterViewInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SignaturePad } from 'angular2-signaturepad';

const defaultSignatureHeight: number = 256;
const defaultSignatureWidth: number = 706;

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
export class SignatureAreaComponent implements ControlValueAccessor, AfterViewInit {
  @Input()
  public signature: string;

  public isValid: boolean;
  public retryImage: string;
  public signHereImage: string;
  public drawCompleteAction: string;
  public clearAction: string;
  public actionLess: boolean;
  public showSignaturePad: boolean = false;

  @ViewChild(SignaturePad, { static: false })
  public signaturePad: SignaturePad;

  @ViewChild('signaturePadElement', { read: ElementRef, static: false })
  signaturePadElement: ElementRef;

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
    this.isValid = null;
    this.actionLess = false;
    this.signHereImage = '/assets/imgs/waiting-room/sign-here.png';
    this.retryImage = '/assets/imgs/waiting-room/retry.png';
  }

  public getSignature() {
    return this.signature;
  }

  public setSignature(initialValue: string) {
    this.signaturePad.fromDataURL(initialValue, { width: this.getSignatureWidth(), height: this.getSignatureHeight() });
    // loading the signature from initial value does not set the internal signature structure, so setting here.
    this.signature = initialValue;
    this.signatureDataChangedDispatch(initialValue);
    this.propagateChange(this.signature);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.signaturePad.clear();
      this.resizeSignaturePad();
      if (this.signature) {
        this.setSignature(this.signature);
      }
    });
  }

  getSignatureHeight(): number {
    return this.signaturePadElement?.nativeElement?.offsetHeight ?? defaultSignatureHeight;
  }

  getSignatureWidth(): number {
    return this.signaturePadElement?.nativeElement?.offsetWidth ?? defaultSignatureWidth;
  }

  resizeSignaturePad(): void {
    if (!!this.signaturePad.queryPad() && !!this.signaturePad.queryPad()._canvas) {
      this.signaturePad.queryPad()._canvas.width = this.getSignatureWidth();
      this.signaturePad.queryPad()._canvas.height = this.getSignatureHeight();
    }
  }

  clear(): void {
    this.signaturePad.clear();
    this.signature = null;
    this.signatureDataClearedDispatch();
    this.propagateChange(this.signature);
  }

  drawComplete(): void {
    this.signature = this.signaturePad.toDataURL();
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

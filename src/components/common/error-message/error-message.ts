import {
  Component, Output, EventEmitter, Input,
} from '@angular/core';
import { ErrorTypes } from '../../../app/shared/models/error-message';

export enum additionalText {
  JOURNAL = 'and try again later.',
  STANDARD_TEXT = 'and try again.',
}

@Component({
  selector: 'error-message',
  templateUrl: 'error-message.html',
})
export class ErrorMessageComponent {

  public additionalText: string;
  public redirectLinkText: string;
  public adviceToUsePaperTest: boolean = false;

  @Input()
  returnTo: string;

  @Output()
  exitModal = new EventEmitter<void>();

  ngOnInit(): void {
    switch (this.returnTo) {
      case ErrorTypes.JOURNAL_REFRESH:
        this.additionalText = additionalText.JOURNAL;
        this.redirectLinkText = this.returnTo;
        break;
      case ErrorTypes.JOURNAL_DATA_MISSING:
        this.additionalText = additionalText.STANDARD_TEXT;
        this.redirectLinkText = 'Dashboard';
        this.adviceToUsePaperTest = true;
        break;
      default:
        this.additionalText = additionalText.STANDARD_TEXT;
        this.redirectLinkText = this.returnTo;
    }
  }

  goBack = (): void => {
    this.exitModal.emit();
  };

}

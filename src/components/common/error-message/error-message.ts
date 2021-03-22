import {
  Component, Output, EventEmitter, Input,
} from '@angular/core';
import { Location } from '@angular/common';
import { ErrorTypes } from '../../../app/shared/models/error-message';

export enum additionalText {
  JOURNAL = 'and try again later.',
  STANDARD_TEXT = 'and try again.',
  TRY_REFRESHING = 'or try refreshing.',
}

@Component({
  selector: 'error-message',
  templateUrl: './error-message.html',
  styleUrls: ['./error-message.scss'],
})
export class ErrorMessageComponent {

  public additionalText: string;
  public redirectLinkText: string;
  public adviceToUsePaperTest: boolean = false;
  defaultErrorStatement: string = 'Sorry, something went wrong';

  @Input()
  returnTo: string;

  @Input()
  displayAsModal: boolean = true;

  @Output()
  exitModal = new EventEmitter<void>();

  constructor(private location: Location) {}

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
      case ErrorTypes.TEST_CENTRE_JOURNAL_NO_RESULT:
        this.defaultErrorStatement = 'There are no test bookings at this location for today and tomorrow';
        break;
      case ErrorTypes.TEST_CENTRE_JOURNAL_ERROR:
        this.additionalText = additionalText.TRY_REFRESHING;
        this.redirectLinkText = 'Dashboard';
        break;
      case ErrorTypes.TEST_CENTRE_OFFLINE:
        this.defaultErrorStatement = 'To view the Test Centre Journal please refresh once you are back online.';
        this.redirectLinkText = 'Dashboard';
        break;
      default:
        this.additionalText = additionalText.STANDARD_TEXT;
        this.redirectLinkText = this.returnTo;
    }
  }

  navigateBack = (): void => {
    this.location.back();
  };

  dismiss = (): void => {
    this.exitModal.emit();
  };

}

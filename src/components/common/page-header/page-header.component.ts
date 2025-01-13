import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'des-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  standalone: true,
  imports: [IonicModule, ComponentsModule, NgIf],
})
export class PageHeaderComponent {
  @Input()
  isEndToEndPracticeMode = false;
  @Input()
  shouldShowGenericEndTest = false;
  @Input()
  shouldShowEndTestLink = true;
  @Input()
  shouldShowBackButton = true;
  @Input()
  isDelegatedRekey = false;
  @Input()
  shouldAuthenticateOnTestEnd = true;
  @Input()
  shouldShowCloseButton = false;
  @Input()
  shouldShowEscapeFromSamButton = false;
  @Input()
  isExitSAMActivated = false;
  @Input()
  textId: string;
  @Input()
  testCategory: string;

  @Output()
  endTestButtonClicked = new EventEmitter<void>();
  @Output()
  onCloseButtonClicked = new EventEmitter<void>();
  @Output()
  onExitSAMActivatedChanged = new EventEmitter<boolean>();

  onEndTestClicked() {
    this.endTestButtonClicked.emit();
  }
  onCloseClicked() {
    this.onCloseButtonClicked.emit();
  }

  changeExitSAMValue(newValue: boolean) {
    this.isExitSAMActivated = newValue;
    this.onExitSAMActivatedChanged.emit(newValue);
  }
}

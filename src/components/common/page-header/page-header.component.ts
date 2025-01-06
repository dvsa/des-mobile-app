import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent implements OnInit {
  @Input()
  isEndToEndPracticeMode = false;
  @Input()
  shouldShowBackButton = true;
  @Input()
  shouldShowCloseButton = false;
  @Input()
  shouldShowEscapeFromSamButton = false;
  @Input()
  isExitSAMActivated = false;
  @Input()
  textId: string;
  @Input()
  headerText: string;
  @Input()
  testCategory: string;

  @Output()
  endTestButtonClicked = new EventEmitter<void>();
  @Output()
  onCloseButtonClicked = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  endTestClicked() {
    this.endTestButtonClicked.emit();
  }
  onCloseClicked() {
    this.onCloseButtonClicked.emit();
  }
}

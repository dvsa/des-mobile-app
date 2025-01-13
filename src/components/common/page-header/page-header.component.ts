import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AppLauncher } from '@capacitor/app-launcher';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { DeviceProvider } from '@providers/device/device';
import { Subscription } from 'rxjs';

@Component({
  selector: 'des-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  standalone: true,
  imports: [IonicModule, ComponentsModule, NgIf],
})
export class PageHeaderComponent implements OnInit, OnDestroy {
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

  resumeSubscription: Subscription;

  constructor(
    public deviceProvider: DeviceProvider,
    public platform: Platform
  ) {}

  ngOnInit() {
    this.resumeSubscription = this.platform.resume.subscribe(async () => {
      if (this.shouldShowEscapeFromSamButton) {
        console.log('Resuming app');
        //Re-enable single app mode to lock the user back in when they come back
        await this.deviceProvider.enableSingleAppMode();
      }
    });
  }

  ngOnDestroy() {
    console.log('Destroying page header');
    if (this.resumeSubscription) {
      this.resumeSubscription.unsubscribe();
    }
  }

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

  async disableSAMAndExit() {
    //disable single app mode
    await this.deviceProvider.disableSingleAppMode();
    try {
      // Go to teams
      await AppLauncher.openUrl({ url: 'msteams://teams.microsoft.com' });
      // Go to settings
      // await AppLauncher.openUrl({ url: 'App-prefs://' });
    } catch (e) {
      console.log(e);
    }
  }
}

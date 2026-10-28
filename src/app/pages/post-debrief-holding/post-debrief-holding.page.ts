import { NgClass } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { IonButton, IonContent, IonHeader, IonToolbar } from '@ionic/angular';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';

@Component({
  selector: 'app-post-debrief-holding',
  templateUrl: './post-debrief-holding.page.html',
  styleUrls: ['./post-debrief-holding.page.scss'],
  imports: [IonHeader, IonToolbar, NgClass, TestFlowHeaderComponent, IonContent, IonButton],
})
export class PostDebriefHoldingPage extends PracticeableBasePageComponent implements OnInit {
  constructor(injector: Injector) {
    super(injector, false);
  }

  async continueButton(): Promise<void> {
    await this.router.navigate([TestFlowPageNames.NON_PASS_FINALISATION_PAGE]);
  }
}

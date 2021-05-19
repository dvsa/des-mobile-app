import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getTests } from '@store/tests/tests.reducer';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { REVERSE_DIAGRAM_PAGE } from '@pages/page-names.constants';
import { AppComponent } from 'src/app/app.component';
import {
  ReverseDiagramClosed,
  ReverseDiagramOpened,
} from '../reverse-diagram-modal/reverse-diagram-modal.actions';

@Component({
  selector: 'reverse-diagram-link',
  templateUrl: 'reverse-diagram-link.html',
  styleUrls: ['reverse-diagram-link.scss'],
})
export class ReverseDiagramLinkComponent implements OnInit {
  subscription: Subscription;
  testCategory: CategoryCode;
  constructor(
    public modalController: ModalController,
    private app: AppComponent,
    private store$: Store<StoreModel>,
  ) {}

  ngOnInit(): void {
    const currentTest$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
    );
    const testCategory$ = currentTest$.pipe(select(getTestCategory));
    this.subscription = testCategory$.pipe(map((result) => this.testCategory = result)).subscribe();
  }

  async openReverseDiagramModal() {
    const diagramPage = REVERSE_DIAGRAM_PAGE;
    this.store$.dispatch(ReverseDiagramOpened());
    // Modals are at the same level as the ion-nav so are not getting the zoom level class,
    // this needs to be passed in the create options.
    const zoomClass = `modal-fullscreen ${this.app.getTextZoomClass()}`;
    const reverseDiagramModal = await this.modalController.create(
      {
        component: diagramPage,
        cssClass: zoomClass,
      },
    );
    reverseDiagramModal.onDidDismiss().then(() => this.closeReverseDiagramModal());
    return reverseDiagramModal.present();
  }

  closeReverseDiagramModal() {
    this.store$.dispatch(ReverseDiagramClosed());
  }
}

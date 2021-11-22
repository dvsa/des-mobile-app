import { waitForAsync, TestBed } from '@angular/core/testing';
import {
  AlertController, ModalController,
} from '@ionic/angular';
import { AlertControllerMock, ModalControllerMock } from 'ionic-mocks';
import { StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';

describe('PracticeTestReportCard ', () => {

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
      ],
      providers: [
        { provide: AlertController, useFactory: () => AlertControllerMock.instance() },
        { provide: ModalController, useFactory: () => ModalControllerMock.instance() },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
  }));

  describe('Class', () => {
    it('should create', () => {
    });
  });
});

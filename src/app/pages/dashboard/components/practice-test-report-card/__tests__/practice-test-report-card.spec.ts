import { waitForAsync, TestBed } from '@angular/core/testing';
import {
  AlertController, ModalController,
} from '@ionic/angular';
import { AlertControllerMock, ModalControllerMock } from 'ionic-mocks';
import { StoreModule } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';
// import { PracticeTestReportCardComponent } from '../practice-test-report-card';
// import { journalReducer } from '../../../../../modules/journal/journal.reducer';

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

  // @TODO: MES-6867 tests will be reinstated when practice test report mode is implemented
  xdescribe('Class', () => {
    it('should create', () => {
    });
  });
});

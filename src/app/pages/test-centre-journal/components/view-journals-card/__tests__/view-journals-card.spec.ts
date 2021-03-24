import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { ExaminerWorkSchedule } from '@dvsa/mes-journal-schema';
import { ViewJournalsCardComponent } from '../view-journals-card';
import { TestCentreDetailResponse } from '../../../../../shared/models/test-centre-journal.model';
import { TestCentreJournalComponentsModule } from '../../test-centre-journal-components.module';

describe('ViewJournalsCardComponent', () => {
  let fixture: ComponentFixture<ViewJournalsCardComponent>;
  let component: ViewJournalsCardComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ViewJournalsCardComponent,
      ],
      imports: [IonicModule, TestCentreJournalComponentsModule],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewJournalsCardComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('interfaceOptions', () => {
      it('should return config for ion-select', () => {
        expect(component.interfaceOptions).toEqual({
          cssClass: 'mes-select',
          enableBackdropDismiss: false,
          placeholder: 'Select examiner',
          okText: 'Select',
          cancelText: 'Cancel',
        });
      });
    });
    describe('examinerChanged', () => {
      it('should use the staffNumber to do a lookup and retrieve appropriate journal', () => {
        component.testCentreResults = {
          examiners: [
            { staffNumber: '123', journal: { examiner: { individualId: 1 } } },
            { staffNumber: '456', journal: { examiner: { individualId: 2 } } },
            { staffNumber: '789', journal: { examiner: { individualId: 3 } } },
          ],
        } as TestCentreDetailResponse;
        component.examinerChanged('456');
        expect(component.journal).toEqual({ examiner: { individualId: 2 } } as ExaminerWorkSchedule);
      });
    });
    // placeholder
    xdescribe('onShowJournalClick', () => {
      it('should ', () => {
      });
    });
  });
});

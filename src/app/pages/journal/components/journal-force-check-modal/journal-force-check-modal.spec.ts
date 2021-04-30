import { JournalForceCheckModal } from './journal-force-check-modal';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { AppModule } from '../../../../app/app.module';
import { IonicModule, NavParams, ViewController } from 'ionic-angular';
import { NavParamsMock, ViewControllerMock } from 'ionic-mocks';
import { By } from '@angular/platform-browser';
import { ComponentsModule } from '../../../../components/common/common-components.module';
import { configureTestSuite } from 'ng-bullet';

describe('JournalForceCheckModal', () => {
  let fixture: ComponentFixture<JournalForceCheckModal>;
  let component: JournalForceCheckModal;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        JournalForceCheckModal,
      ],
      imports: [
        AppModule,
        IonicModule,
        ComponentsModule,
      ],
      providers: [
        { provide: NavParams, useFactory: () => NavParamsMock.instance() },
        { provide: ViewController, useFactory: () => ViewControllerMock.instance() },
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JournalForceCheckModal);
    component = fixture.componentInstance;
    component.onCancel = () => {
    };
  }));

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });

  describe('DOM', () => {
    it('should call onCancel when the Cancel button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onCancel');
      const button = fixture.debugElement.query(By.css('modal-return-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onCancel).toHaveBeenCalled();
    });
  });
});

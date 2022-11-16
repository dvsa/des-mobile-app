import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/index.mock';
import { AppModule } from 'src/app/app.module';
import { By } from '@angular/platform-browser';
import { ComponentsModule } from '@components/common/common-components.module';
import { EtaInvalidModal } from '../eta-invalid-modal';

describe('EtaInvalidModal', () => {
  let fixture: ComponentFixture<EtaInvalidModal>;
  let component: EtaInvalidModal;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        EtaInvalidModal,
      ],
      imports: [
        AppModule,
        ComponentsModule,
        IonicModule,
      ],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
      ],
    });

    fixture = TestBed.createComponent(EtaInvalidModal);
    component = fixture.componentInstance;
    component.onCancel = () => Promise.resolve();
  }));

  describe('DOM', () => {
    it('should call onCancel when the Return to test button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'onCancel');
      const button = fixture.debugElement.query(By.css('ion-button.modal-return-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onCancel).toHaveBeenCalled();
    });
  });
});

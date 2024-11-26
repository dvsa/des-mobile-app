import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';

import { AppModule } from '@app/app.module';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { UploadRekeyModal } from '../upload-rekey-modal';

describe('UploadRekeyModal', () => {
  let fixture: ComponentFixture<UploadRekeyModal>;
  let component: UploadRekeyModal;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UploadRekeyModal],
      imports: [IonicModule, AppModule],
      providers: [{ provide: ModalController, useClass: ModalControllerMock }],
    });

    fixture = TestBed.createComponent(UploadRekeyModal);
    component = fixture.componentInstance;
    component.onCancel = async () => {};
    component.onUpload = async () => {};
  }));

  describe('DOM', () => {
    it('should call the provided onCancel function when cancelling the upload', () => {
      fixture.detectChanges();
      spyOn(component, 'onCancel');
      const button = fixture.debugElement.query(By.css('.cancel-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onCancel).toHaveBeenCalled();
    });
    it('should call the provided onUpload function when confirming the upload', () => {
      fixture.detectChanges();
      spyOn(component, 'onUpload');
      const button = fixture.debugElement.query(By.css('.upload-button'));
      button.triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(component.onUpload).toHaveBeenCalled();
    });
  });
});

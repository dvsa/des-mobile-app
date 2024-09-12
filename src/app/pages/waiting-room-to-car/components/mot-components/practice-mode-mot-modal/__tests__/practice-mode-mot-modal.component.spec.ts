import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalEvent } from '@pages/test-report/test-report.constants';
import { PracticeModeMOTModal, PracticeModeMOTType } from '../practice-mode-mot-modal.component';

describe('PracticeModeMOTModal', () => {
  let component: PracticeModeMOTModal;
  let fixture: ComponentFixture<PracticeModeMOTModal>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PracticeModeMOTModal],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PracticeModeMOTModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should dismiss the modal with the correct type on confirm', async () => {
    spyOn(component.modalCtrl, 'dismiss');
    await component.onConfirm(PracticeModeMOTType.PASS);
    expect(component.modalCtrl.dismiss).toHaveBeenCalledWith(PracticeModeMOTType.PASS);
  });

  it('should dismiss the modal with cancel event on cancel', async () => {
    spyOn(component.modalCtrl, 'dismiss');
    await component.onCancel();
    expect(component.modalCtrl.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
  });

  it('should handle dismiss failure on confirm', async () => {
    spyOn(component.modalCtrl, 'dismiss').and.throwError('Dismiss failed');
    try {
      await component.onConfirm(PracticeModeMOTType.PASS);
    } catch (e) {
      expect(e.message).toBe('Dismiss failed');
    }
  });

  it('should handle dismiss failure on cancel', async () => {
    spyOn(component.modalCtrl, 'dismiss').and.throwError('Dismiss failed');
    try {
      await component.onCancel();
    } catch (e) {
      expect(e.message).toBe('Dismiss failed');
    }
  });
});

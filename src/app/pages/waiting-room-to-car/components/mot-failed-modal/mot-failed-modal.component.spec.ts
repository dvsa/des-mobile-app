import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MotFailedModal } from './mot-failed-modal.component';

describe('MotFailedModal', () => {
  let component: MotFailedModal;
  let fixture: ComponentFixture<MotFailedModal>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MotFailedModal],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(MotFailedModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

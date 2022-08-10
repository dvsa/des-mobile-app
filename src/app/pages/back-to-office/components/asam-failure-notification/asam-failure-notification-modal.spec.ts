import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AsamFailureNotificationComponent } from './asam-failure-notification-modal';

describe('AsamFailureNotificationComponent', () => {
  let component: AsamFailureNotificationComponent;
  let fixture: ComponentFixture<AsamFailureNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsamFailureNotificationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AsamFailureNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

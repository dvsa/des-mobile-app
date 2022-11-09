import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ETACardComponent } from '../eta-card.component';

fdescribe('EtaCardComponent', () => {
  let component: ETACardComponent;
  let fixture: ComponentFixture<ETACardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ETACardComponent],
      imports: [IonicModule],
    });

    fixture = TestBed.createComponent(ETACardComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

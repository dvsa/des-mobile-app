import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { ETACardComponent } from './eta-card.component';

describe('EtaCardComponent', () => {
  let component: ETACardComponent;
  let fixture: ComponentFixture<ETACardComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ETACardComponent],
      imports: [IonicModule],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ETACardComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { HeaderComponent } from '@components/common/header-component/header.component';
import { ETACardComponent } from '../eta-card.component';

describe('EtaCardComponent', () => {
  let component: ETACardComponent;
  let fixture: ComponentFixture<ETACardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ETACardComponent,
        MockComponent(HeaderComponent),
      ],
      imports: [IonicModule],
    });

    fixture = TestBed.createComponent(ETACardComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

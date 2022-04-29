import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ETACardComponent } from './eta-card.component';

describe('EtaCardComponent', () => {
  let component: ETACardComponent;
  let fixture: ComponentFixture<ETACardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ETACardComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ETACardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

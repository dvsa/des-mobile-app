import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ECOCardComponent } from './eco-card.component';

describe('ECOCardComponent', () => {
  let component: ECOCardComponent;
  let fixture: ComponentFixture<ECOCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ECOCardComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ECOCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

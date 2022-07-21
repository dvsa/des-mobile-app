import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReasonGivenComponent } from '../reason-given.component';

describe('ReasonGivenComponent', () => {
  let component: ReasonGivenComponent;
  let fixture: ComponentFixture<ReasonGivenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReasonGivenComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ReasonGivenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

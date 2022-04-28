import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DrivingFaultsComponent } from './driving-faults.component';

describe('DrivingFaultsComponent', () => {
  let component: DrivingFaultsComponent;
  let fixture: ComponentFixture<DrivingFaultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DrivingFaultsComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(DrivingFaultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

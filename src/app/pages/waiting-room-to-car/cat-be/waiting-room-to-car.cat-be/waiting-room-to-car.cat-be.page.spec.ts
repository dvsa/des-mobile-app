import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WaitingRoomToCar.CatBePage } from './waiting-room-to-car.cat-be.page';

describe('WaitingRoomToCar.CatBePage', () => {
  let component: WaitingRoomToCar.CatBePage;
  let fixture: ComponentFixture<WaitingRoomToCar.CatBePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingRoomToCar.CatBePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WaitingRoomToCar.CatBePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

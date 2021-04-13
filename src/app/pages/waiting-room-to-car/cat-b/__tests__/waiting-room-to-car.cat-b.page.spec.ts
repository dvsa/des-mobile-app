import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WaitingRoomToCarCatBPage } from '../waiting-room-to-car.cat-b.page';

describe('WaitingRoomToCar.CatBPage', () => {
  let component: WaitingRoomToCarCatBPage;
  let fixture: ComponentFixture<WaitingRoomToCarCatBPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WaitingRoomToCarCatBPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(WaitingRoomToCarCatBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

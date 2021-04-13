import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WaitingRoomCatBPage } from '../waiting-room.cat-b.page';

describe('WaitingRoom.CatBPage', () => {
  let component: WaitingRoomCatBPage;
  let fixture: ComponentFixture<WaitingRoomCatBPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WaitingRoomCatBPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(WaitingRoomCatBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

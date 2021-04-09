import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WaitingRoomCatAdiPart2Page } from './waiting-room.cat-adi-part2.page';

describe('WaitingRoom.CatAdiPart2Page', () => {
  let component: WaitingRoomCatAdiPart2Page;
  let fixture: ComponentFixture<WaitingRoomCatAdiPart2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WaitingRoomCatAdiPart2Page],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(WaitingRoomCatAdiPart2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WaitingRoom.CatBePage } from './waiting-room.cat-be.page';

describe('WaitingRoom.CatBePage', () => {
  let component: WaitingRoom.CatBePage;
  let fixture: ComponentFixture<WaitingRoom.CatBePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingRoom.CatBePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WaitingRoom.CatBePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { WaitingRoomToCarCatBEPage } from '../waiting-room-to-car.cat-be.page';

describe('WaitingRoomToCarCatBEPage', () => {
  let component: WaitingRoomToCarCatBEPage;
  let fixture: ComponentFixture<WaitingRoomToCarCatBEPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WaitingRoomToCarCatBEPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WaitingRoomToCarCatBEPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

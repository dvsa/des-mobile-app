import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { CommunicationCatAMod1Page } from '../communication.cat-a-mod1.page';

describe('Communication.CatAMod1Page', () => {
  let component: CommunicationCatAMod1Page;
  let fixture: ComponentFixture<CommunicationCatAMod1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommunicationCatAMod1Page],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunicationCatAMod1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

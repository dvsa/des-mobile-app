import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { BackToOfficeCatAMod2Page } from '../back-to-office.cat-a-mod2.page';

describe('BackToOfficeCatAMod2Page', () => {
  let component: BackToOfficeCatAMod2Page;
  let fixture: ComponentFixture<BackToOfficeCatAMod2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BackToOfficeCatAMod2Page],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BackToOfficeCatAMod2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

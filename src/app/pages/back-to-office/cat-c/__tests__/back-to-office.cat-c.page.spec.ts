import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { BackToOfficeCatCPage } from '../back-to-office.cat-c.page';

describe('BackToOfficeCatCPage', () => {
  let component: BackToOfficeCatCPage;
  let fixture: ComponentFixture<BackToOfficeCatCPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BackToOfficeCatCPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BackToOfficeCatCPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

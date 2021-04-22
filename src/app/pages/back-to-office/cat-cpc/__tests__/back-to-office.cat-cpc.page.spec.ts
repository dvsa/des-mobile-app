import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { BackToOfficeCatCPCPage } from '../back-to-office.cat-cpc.page';

describe('BackToOfficeCatCPCPage', () => {
  let component: BackToOfficeCatCPCPage;
  let fixture: ComponentFixture<BackToOfficeCatCPCPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BackToOfficeCatCPCPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BackToOfficeCatCPCPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { HealthDeclarationCatCPCPage } from '../health-declaration.cat-cpc.page';

describe('HealthDeclaration.CatCPCPage', () => {
  let component: HealthDeclarationCatCPCPage;
  let fixture: ComponentFixture<HealthDeclarationCatCPCPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HealthDeclarationCatCPCPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthDeclarationCatCPCPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

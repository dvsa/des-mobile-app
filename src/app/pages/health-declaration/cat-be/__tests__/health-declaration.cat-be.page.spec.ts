import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { HealthDeclarationCatBePage } from '../health-declaration.cat-be.page';

describe('HealthDeclaration.CatBePage', () => {
  let component: HealthDeclarationCatBePage;
  let fixture: ComponentFixture<HealthDeclarationCatBePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HealthDeclarationCatBePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HealthDeclarationCatBePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

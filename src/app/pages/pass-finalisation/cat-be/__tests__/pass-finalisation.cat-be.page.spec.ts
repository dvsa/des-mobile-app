import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { PassFinalisationCatBePage } from '../pass-finalisation.cat-be.page';

describe('PassFinalisation.CatBePage', () => {
  let component: PassFinalisationCatBePage;
  let fixture: ComponentFixture<PassFinalisationCatBePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PassFinalisationCatBePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PassFinalisationCatBePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { PassFinalisationCatCPCPage } from '../pass-finalisation.cat-cpc.page';

describe('PassFinalisation.CatCPCPage', () => {
  let component: PassFinalisationCatCPCPage;
  let fixture: ComponentFixture<PassFinalisationCatCPCPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PassFinalisationCatCPCPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PassFinalisationCatCPCPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { PassFinalisationCatAMod2Page } from '../pass-finalisation.cat-a-mod2.page';

describe('PassFinalisationCatAMod2Page', () => {
  let component: PassFinalisationCatAMod2Page;
  let fixture: ComponentFixture<PassFinalisationCatAMod2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PassFinalisationCatAMod2Page],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PassFinalisationCatAMod2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

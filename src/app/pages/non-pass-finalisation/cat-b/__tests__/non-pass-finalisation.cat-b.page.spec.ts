import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { NonPassFinalisationCatBPage } from '../non-pass-finalisation.cat-b.page';

describe('NonPassFinalisationCatBPage', () => {
  let component: NonPassFinalisationCatBPage;
  let fixture: ComponentFixture<NonPassFinalisationCatBPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NonPassFinalisationCatBPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NonPassFinalisationCatBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

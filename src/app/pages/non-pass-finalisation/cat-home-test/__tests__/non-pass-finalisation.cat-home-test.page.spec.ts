import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { NonPassFinalisationCatHomeTestPage } from '../non-pass-finalisation.cat-home-test.page';

describe('NonPassFinalisationCatHomeTestPage', () => {
  let component: NonPassFinalisationCatHomeTestPage;
  let fixture: ComponentFixture<NonPassFinalisationCatHomeTestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NonPassFinalisationCatHomeTestPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NonPassFinalisationCatHomeTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

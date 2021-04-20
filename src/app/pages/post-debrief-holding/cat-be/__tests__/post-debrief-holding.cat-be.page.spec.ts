import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { PostDebriefHoldingCatBEPage } from '../post-debrief-holding.cat-be.page';

describe('PostDebriefHolding.CatBEPage', () => {
  let component: PostDebriefHoldingCatBEPage;
  let fixture: ComponentFixture<PostDebriefHoldingCatBEPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PostDebriefHoldingCatBEPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostDebriefHoldingCatBEPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

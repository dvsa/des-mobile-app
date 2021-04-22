import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { PostDebriefHoldingCatAMod1Page } from '../post-debrief-holding.cat-a-mod1.page';

describe('PostDebriefHolding.CatAMod1Page', () => {
  let component: PostDebriefHoldingCatAMod1Page;
  let fixture: ComponentFixture<PostDebriefHoldingCatAMod1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PostDebriefHoldingCatAMod1Page],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostDebriefHoldingCatAMod1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { PostDebriefHoldingCatAMod2Page } from '../post-debrief-holding.cat-a-mod2.page';

describe('PostDebriefHoldingCatDPage', () => {
  let component: PostDebriefHoldingCatAMod2Page;
  let fixture: ComponentFixture<PostDebriefHoldingCatAMod2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PostDebriefHoldingCatAMod2Page],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostDebriefHoldingCatAMod2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

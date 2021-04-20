import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { PostDebriefHoldingCatDPage } from '../post-debrief-holding.cat-d.page';

describe('PostDebriefHoldingCatDPage', () => {
  let component: PostDebriefHoldingCatDPage;
  let fixture: ComponentFixture<PostDebriefHoldingCatDPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PostDebriefHoldingCatDPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostDebriefHoldingCatDPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

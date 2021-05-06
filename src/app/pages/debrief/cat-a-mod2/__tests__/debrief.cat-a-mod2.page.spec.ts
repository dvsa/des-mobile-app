import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { DebriefCatAMod2Page } from '../debrief.cat-a-mod2.page';

describe('DebriefCatAMod2Page', () => {
  let component: DebriefCatAMod2Page;
  let fixture: ComponentFixture<DebriefCatAMod2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DebriefCatAMod2Page],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DebriefCatAMod2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

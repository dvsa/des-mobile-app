import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { DebriefCatAdiPart2Page } from '../debrief.cat-adi-part2.page';

describe('Debrief.CatADIPart2Page', () => {
  let component: DebriefCatAdiPart2Page;
  let fixture: ComponentFixture<DebriefCatAdiPart2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DebriefCatAdiPart2Page],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DebriefCatAdiPart2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

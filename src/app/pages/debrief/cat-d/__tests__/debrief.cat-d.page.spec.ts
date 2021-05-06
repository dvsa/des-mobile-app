import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { DebriefCatDPage } from '../debrief.cat-d.page';

describe('DebriefCatDPage', () => {
  let component: DebriefCatDPage;
  let fixture: ComponentFixture<DebriefCatDPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DebriefCatDPage],
      imports: [IonicModule.forRoot()],
      providers: [
        // { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DebriefCatDPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

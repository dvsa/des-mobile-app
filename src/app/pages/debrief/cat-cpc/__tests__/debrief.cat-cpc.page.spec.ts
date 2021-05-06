import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { DebriefCatCPCPage } from '../debrief.cat-cpc.page';

describe('Debrief.CatCPCPage', () => {
  let component: DebriefCatCPCPage;
  let fixture: ComponentFixture<DebriefCatCPCPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DebriefCatCPCPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DebriefCatCPCPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

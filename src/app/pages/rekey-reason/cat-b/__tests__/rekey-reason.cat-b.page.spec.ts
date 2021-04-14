import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { RekeyReasonCatBPage } from '../rekey-reason.cat-b.page';

describe('RekeyReason.CatBPage', () => {
  let component: RekeyReasonCatBPage;
  let fixture: ComponentFixture<RekeyReasonCatBPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RekeyReasonCatBPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RekeyReasonCatBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

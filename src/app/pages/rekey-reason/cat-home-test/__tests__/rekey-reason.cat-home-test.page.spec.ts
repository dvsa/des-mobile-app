import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { RekeyReasonCatHomeTestPage } from '../rekey-reason.cat-home-test.page';

describe('RekeyReason.CatHomeTestPage', () => {
  let component: RekeyReasonCatHomeTestPage;
  let fixture: ComponentFixture<RekeyReasonCatHomeTestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RekeyReasonCatHomeTestPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RekeyReasonCatHomeTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

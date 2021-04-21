import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { NavMock } from '@mocks/angular-mocks/nav-mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { RekeyReasonCatAMod1Page } from '../rekey-reason.cat-a-mod1.page';

describe('RekeyReason.CatAMod1Page', () => {
  let component: RekeyReasonCatAMod1Page;
  let fixture: ComponentFixture<RekeyReasonCatAMod1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RekeyReasonCatAMod1Page],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useClass: NavMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RekeyReasonCatAMod1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

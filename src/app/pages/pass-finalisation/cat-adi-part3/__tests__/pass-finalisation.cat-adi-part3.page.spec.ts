import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavController, Platform, IonicModule } from '@ionic/angular';
import { NavControllerMock, PlatformMock } from 'ionic-mocks';
import { Router } from '@angular/router';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { Store } from '@ngrx/store';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { PassFinalisationCatADIPart3Page } from '../pass-finalisation.cat-adi-part3.page';

fdescribe('PassFinalisation.CatAdiPart3.Page.HtmlPage', () => {
  let component: PassFinalisationCatADIPart3Page;
  let fixture: ComponentFixture<PassFinalisationCatADIPart3Page>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PassFinalisationCatADIPart3Page],
      imports: [IonicModule.forRoot()],
      providers: [
        {
          provide: Platform,
          useFactory: () => PlatformMock.instance(),
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: Router,
          useValue: routerSpy,
        },
        { provide: Store },
        {
          provide: RouteByCategoryProvider,
          useClass: RouteByCategoryProviderMock,
        },
        {
          provide: NavController,
          useClass: NavControllerMock,
        },
        OutcomeBehaviourMapProvider,
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(PassFinalisationCatADIPart3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });
});

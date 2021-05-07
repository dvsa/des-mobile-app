import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';

import { Router } from '@angular/router';
import { CommunicationPage } from '../communication.page';

fdescribe('Communication.Page', () => {
  let component: CommunicationPage;
  let fixture: ComponentFixture<CommunicationPage>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommunicationPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunicationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

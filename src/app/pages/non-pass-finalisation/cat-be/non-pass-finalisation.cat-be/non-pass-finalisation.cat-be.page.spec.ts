import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NonPassFinalisation.CatBePage } from './non-pass-finalisation.cat-be.page';

describe('NonPassFinalisation.CatBePage', () => {
  let component: NonPassFinalisation.CatBePage;
  let fixture: ComponentFixture<NonPassFinalisation.CatBePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonPassFinalisation.CatBePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NonPassFinalisation.CatBePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

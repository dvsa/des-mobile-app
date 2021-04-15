import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PassFinalisation.CatBePage } from './pass-finalisation.cat-be.page';

describe('PassFinalisation.CatBePage', () => {
  let component: PassFinalisation.CatBePage;
  let fixture: ComponentFixture<PassFinalisation.CatBePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassFinalisation.CatBePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PassFinalisation.CatBePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

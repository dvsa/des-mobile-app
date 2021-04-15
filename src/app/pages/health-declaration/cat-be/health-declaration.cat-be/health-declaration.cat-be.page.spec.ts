import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HealthDeclaration.CatBePage } from './health-declaration.cat-be.page';

describe('HealthDeclaration.CatBePage', () => {
  let component: HealthDeclaration.CatBePage;
  let fixture: ComponentFixture<HealthDeclaration.CatBePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthDeclaration.CatBePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HealthDeclaration.CatBePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

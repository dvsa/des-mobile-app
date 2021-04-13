import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HealthDeclarationCatBPage } from '../health-declaration.cat-b.page';

describe('HealthDeclaration.CatBPage', () => {
  let component: HealthDeclarationCatBPage;
  let fixture: ComponentFixture<HealthDeclarationCatBPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthDeclarationCatBPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HealthDeclarationCatBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

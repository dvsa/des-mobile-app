import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Office.CatBePage } from './office.cat-be.page';

describe('Office.CatBePage', () => {
  let component: Office.CatBePage;
  let fixture: ComponentFixture<Office.CatBePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Office.CatBePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Office.CatBePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

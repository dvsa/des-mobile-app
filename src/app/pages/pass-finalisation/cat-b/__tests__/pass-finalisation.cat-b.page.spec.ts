import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PassFinalisationCatBPage } from '../pass-finalisation.cat-b.page';

describe('PassFinalisation.CatBPage', () => {
  let component: PassFinalisationCatBPage;
  let fixture: ComponentFixture<PassFinalisationCatBPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassFinalisationCatBPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PassFinalisationCatBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

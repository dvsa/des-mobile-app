import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { PassFinalisationCatADIPart3Page } from '../pass-finalisation.cat-adi-part3.page';

describe('PassFinalisation.CatAdiPart3.Page.HtmlPage', () => {
  let component: PassFinalisationCatADIPart3Page;
  let fixture: ComponentFixture<PassFinalisationCatADIPart3Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PassFinalisationCatADIPart3Page],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PassFinalisationCatADIPart3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

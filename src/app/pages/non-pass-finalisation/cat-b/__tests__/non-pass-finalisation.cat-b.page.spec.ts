import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NonPassFinalisationCatBPage } from '../non-pass-finalisation.cat-b.page';

describe('NonPassFinalisationCatBPage', () => {
  let component: NonPassFinalisationCatBPage;
  let fixture: ComponentFixture<NonPassFinalisationCatBPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NonPassFinalisationCatBPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(NonPassFinalisationCatBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

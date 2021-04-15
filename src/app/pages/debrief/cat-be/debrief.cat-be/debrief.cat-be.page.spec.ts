import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Debrief.CatBePage } from './debrief.cat-be.page';

describe('Debrief.CatBePage', () => {
  let component: Debrief.CatBePage;
  let fixture: ComponentFixture<Debrief.CatBePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Debrief.CatBePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Debrief.CatBePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

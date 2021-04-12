import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DebriefCatBPage } from './debrief.cat-b.page';

describe('Debrief.CatBPage', () => {
  let component: DebriefCatBPage;
  let fixture: ComponentFixture<DebriefCatBPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebriefCatBPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DebriefCatBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

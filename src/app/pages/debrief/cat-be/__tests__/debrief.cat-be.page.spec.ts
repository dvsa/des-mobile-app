import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DebriefCatBePage } from '../debrief.cat-be.page';

describe('DebriefCatBePage', () => {
  let component: DebriefCatBePage;
  let fixture: ComponentFixture<DebriefCatBePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebriefCatBePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DebriefCatBePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OfficeCatBPage } from '../office.cat-b.page';

describe('OfficeCatBPage', () => {
  let component: OfficeCatBPage;
  let fixture: ComponentFixture<OfficeCatBPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficeCatBPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OfficeCatBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

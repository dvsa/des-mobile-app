import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RekeyReason.CatBePage } from './rekey-reason.cat-be.page';

describe('RekeyReason.CatBePage', () => {
  let component: RekeyReason.CatBePage;
  let fixture: ComponentFixture<RekeyReason.CatBePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RekeyReason.CatBePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RekeyReason.CatBePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

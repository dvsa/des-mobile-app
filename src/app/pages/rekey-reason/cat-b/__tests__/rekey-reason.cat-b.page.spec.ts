import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RekeyReasonCatBPage } from '../rekey-reason.cat-b.page';

describe('RekeyReason.CatBPage', () => {
  let component: RekeyReasonCatBPage;
  let fixture: ComponentFixture<RekeyReasonCatBPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RekeyReasonCatBPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RekeyReasonCatBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

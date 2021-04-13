import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BackToOfficeCatBPage } from '../back-to-office.cat-b.page';

fdescribe('BackToOfficeCatBPage', () => {
  let component: BackToOfficeCatBPage;
  let fixture: ComponentFixture<BackToOfficeCatBPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BackToOfficeCatBPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(BackToOfficeCatBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

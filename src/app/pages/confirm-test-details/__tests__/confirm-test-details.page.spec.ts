import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConfirmTestDetailsPage } from '../confirm-test-details.page';

describe('ConfirmTestDetailsPage', () => {
  let component: ConfirmTestDetailsPage;
  let fixture: ComponentFixture<ConfirmTestDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmTestDetailsPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmTestDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

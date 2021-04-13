import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CommunicationCatBPage } from '../communication.cat-b.page';

describe('Communication.CatBPage', () => {
  let component: CommunicationCatBPage;
  let fixture: ComponentFixture<CommunicationCatBPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommunicationCatBPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunicationCatBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

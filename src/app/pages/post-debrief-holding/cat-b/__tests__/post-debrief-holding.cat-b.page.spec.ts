import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostDebriefHoldingCatBPage } from '../post-debrief-holding.cat-b.page';

describe('PostDebriefHolding.CatBPage', () => {
  let component: PostDebriefHoldingCatBPage;
  let fixture: ComponentFixture<PostDebriefHoldingCatBPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostDebriefHoldingCatBPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PostDebriefHoldingCatBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

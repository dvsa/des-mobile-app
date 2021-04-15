import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostDebriefHolding.CatBePage } from './post-debrief-holding.cat-be.page';

describe('PostDebriefHolding.CatBePage', () => {
  let component: PostDebriefHolding.CatBePage;
  let fixture: ComponentFixture<PostDebriefHolding.CatBePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostDebriefHolding.CatBePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PostDebriefHolding.CatBePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed, waitForAsync, ComponentFixture } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TestCategoryComponent } from '../test-category';

describe('TestCategoryComponent', () => {
  let fixture: ComponentFixture<TestCategoryComponent>;
  let component: TestCategoryComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestCategoryComponent],
      imports: [IonicModule],
    });

    fixture = TestBed.createComponent(TestCategoryComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });
});

import { TestBed, waitForAsync, ComponentFixture } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { TestCategoryComponent } from '../test-category';

describe('TestCategoryComponent', () => {
  let fixture: ComponentFixture<TestCategoryComponent>;
  let component: TestCategoryComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestCategoryComponent,
      ],
      imports: [IonicModule],

    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(TestCategoryComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });
});

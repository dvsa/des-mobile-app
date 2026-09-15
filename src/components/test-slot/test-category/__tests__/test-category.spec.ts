import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonText } from '@ionic/angular';
import { TestCategoryComponent } from '../test-category';

describe('TestCategoryComponent', () => {
  let fixture: ComponentFixture<TestCategoryComponent>;
  let component: TestCategoryComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonText],
      declarations: [TestCategoryComponent],
    });

    fixture = TestBed.createComponent(TestCategoryComponent);
    component = fixture.componentInstance;
  });

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });
});

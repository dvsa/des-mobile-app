import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCategoryComponent } from '../test-category';

describe('TestCategoryComponent', () => {
  let fixture: ComponentFixture<TestCategoryComponent>;
  let component: TestCategoryComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestCategoryComponent],
    });

    fixture = TestBed.createComponent(TestCategoryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

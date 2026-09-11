import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCentreNameComponent } from '../test-centre-name';

describe('TestCentreNameComponent', () => {
  let fixture: ComponentFixture<TestCentreNameComponent>;
  let component: TestCentreNameComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestCentreNameComponent],

    });

    fixture = TestBed.createComponent(TestCentreNameComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataRowComponent } from '@components/common/data-row/data-row';

import { MockComponent } from 'ng-mocks';
import { ExaminerDetailsCardComponent } from '../examiner-details';

describe('ExaminerDetailsCardComponent', () => {
  let fixture: ComponentFixture<ExaminerDetailsCardComponent>;
  let component: ExaminerDetailsCardComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExaminerDetailsCardComponent, MockComponent(DataRowComponent)],

    });

    fixture = TestBed.createComponent(ExaminerDetailsCardComponent);
    component = fixture.componentInstance;
  });

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedCardComponent } from '@pages/view-test-result/components/speed-card/speed-card';

describe('SpeedCardComponent', () => {
  let fixture: ComponentFixture<SpeedCardComponent>;
  let component: SpeedCardComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpeedCardComponent],

    });

    fixture = TestBed.createComponent(SpeedCardComponent);
    component = fixture.componentInstance;
  });

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});

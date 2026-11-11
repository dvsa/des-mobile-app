import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestRecoveredBannerComponent } from '@components/common/test-recovered-banner/test-recovered-banner';
import { beforeEach, describe, expect, it } from 'vitest';

describe('TestRecoveredBannerComponent', () => {
  let component: TestRecoveredBannerComponent;
  let fixture: ComponentFixture<TestRecoveredBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestRecoveredBannerComponent],
    });

    fixture = TestBed.createComponent(TestRecoveredBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

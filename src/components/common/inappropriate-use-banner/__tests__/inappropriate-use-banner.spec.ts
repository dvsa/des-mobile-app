import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InappropriateUseBannerComponent } from '@components/common/inappropriate-use-banner/inappropriate-use-banner';
import { beforeEach, describe, expect, it } from 'vitest';

describe('InappropriateUseBannerComponent', () => {
  let component: InappropriateUseBannerComponent;
  let fixture: ComponentFixture<InappropriateUseBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InappropriateUseBannerComponent],
    });

    fixture = TestBed.createComponent(InappropriateUseBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

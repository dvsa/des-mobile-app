import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PracticeModeBanner } from '../practice-mode-banner';

describe('PracticeModeBanner', () => {
  let fixture: ComponentFixture<PracticeModeBanner>;
  let component: PracticeModeBanner;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PracticeModeBanner],
    });

    fixture = TestBed.createComponent(PracticeModeBanner);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

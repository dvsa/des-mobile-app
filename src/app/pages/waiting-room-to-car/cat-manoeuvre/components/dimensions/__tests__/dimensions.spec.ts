import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimensionsComponent } from '@pages/waiting-room-to-car/cat-manoeuvre/components/dimensions/dimensions';
import { PipesModule } from '@shared/pipes/pipes.module';

describe('DimensionsComponent', () => {
  let component: DimensionsComponent;
  let fixture: ComponentFixture<DimensionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DimensionsComponent],
      imports: [PipesModule],
    });

    fixture = TestBed.createComponent(DimensionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

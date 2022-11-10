import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { DataRowComponent } from '@components/common/data-row/data-row';
import { TrainerDetailsCardComponent } from '../trainer-details-card';

describe('TrainerDetailsCardComponent', () => {
  let fixture: ComponentFixture<TrainerDetailsCardComponent>;
  let component: TrainerDetailsCardComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TrainerDetailsCardComponent,
        MockComponent(DataRowComponent),
      ],
      imports: [
        IonicModule,
      ],
    });

    fixture = TestBed.createComponent(TrainerDetailsCardComponent);
    component = fixture.componentInstance;
  });

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

});

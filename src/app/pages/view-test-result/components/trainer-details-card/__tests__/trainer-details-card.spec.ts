import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { DataRowComponent } from '@components/common/data-row/data-row';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { HeaderComponent } from '@components/common/header-component/header.component';
import { TrainerDetailsCardComponent } from '../trainer-details-card';

describe('TrainerDetailsCardComponent', () => {
  let fixture: ComponentFixture<TrainerDetailsCardComponent>;
  let component: TrainerDetailsCardComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TrainerDetailsCardComponent,
        MockComponent(DataRowComponent),
        MockComponent(HeaderComponent),
      ],
      imports: [
        IonicModule,
      ],
    });

    fixture = TestBed.createComponent(TrainerDetailsCardComponent);
    component = fixture.componentInstance;
  });

  describe('isADI3', () => {
    it('should return true if category is ADI3', () => {
      component.category = TestCategory.ADI3;
      expect(component.isADI3()).toEqual(true);
    });
    it('should return false if category is not ADI3', () => {
      component.category = TestCategory.B;
      expect(component.isADI3()).toEqual(false);
    });
  });

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

});

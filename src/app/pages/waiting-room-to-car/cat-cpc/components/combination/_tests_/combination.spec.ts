import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormGroup } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '@app/app.module';
import { CombinationComponent } from '../combination';

describe('CombinationComponent', () => {
  let fixture: ComponentFixture<CombinationComponent>;
  let component: CombinationComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        CombinationComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(CombinationComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
  }));

  describe('combinationChanged', () => {
    it('should emit the value passed into the function', () => {
      spyOn(component.combinationChange, 'emit');
      component.combinationChanged('LGV1');
      expect(component.combinationChange.emit).toHaveBeenCalledWith('LGV1');
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { configureTestSuite } from 'ng-bullet';
import { DataRowComponent } from '@components/common/data-row/data-row';
import { DataRowCustomComponent } from '@components/common/data-row-custom/data-row-custom';
import { TransmissionDisplayComponent } from '@components/common/transmission-display/transmission-display';
import { TrainerDetailsCardComponent } from '../trainer-details-card';

describe('VehicleDetailsCardComponent', () => {

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        TrainerDetailsCardComponent,
        MockComponent(DataRowComponent),
        MockComponent(DataRowCustomComponent),
        MockComponent(TransmissionDisplayComponent),
      ],
      imports: [
        IonicModule,
      ],
    });
  });

});

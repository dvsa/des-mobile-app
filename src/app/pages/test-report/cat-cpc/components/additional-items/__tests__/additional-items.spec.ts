import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppModule } from '@app/app.module';
import { AdditionalItemsComponent } from '../additional-items';
import { mockEmptyAdditionalItems, mockPopulatedAdditionalItems } from '../__mocks__/additional-items.mock';

describe('AdditionalItemsComponent', () => {
  let fixture: ComponentFixture<AdditionalItemsComponent>;
  let component: AdditionalItemsComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdditionalItemsComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
    });

    fixture = TestBed.createComponent(AdditionalItemsComponent);
    component = fixture.componentInstance;
  }));

  describe('showAdditionalItems', () => {
    it('should return a true when the additionalItems length is greater than 0', () => {
      expect(component.showAdditionalItems(mockPopulatedAdditionalItems)).toEqual(true);
    });

    it('should return a false when the additionalItems length is not greater than 0', () => {
      expect(component.showAdditionalItems(mockEmptyAdditionalItems)).toEqual(false);
    });
  });
});

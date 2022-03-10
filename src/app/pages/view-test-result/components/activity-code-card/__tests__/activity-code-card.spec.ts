import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MockComponent } from 'ng-mocks';
import { DataRowComponent } from '@components/common/data-row/data-row';
import { configureTestSuite } from 'ng-bullet';
import { ActivityCodeCard } from '../activity-code-card';

describe('ActivityCodeCard', () => {
  let component: ActivityCodeCard;
  let fixture: ComponentFixture<ActivityCodeCard>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ActivityCodeCard,
        MockComponent(DataRowComponent),
      ],
      imports: [
        IonicModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ActivityCodeCard);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getActivityCodeDescription', () => {
    it('should set description to UNAUTHORISED_FILMING and return the'
        + 'description for that entry upon passing a code of 41 ', () => {
      component.activityCode = '41';
      expect(component.getActivityCodeDescription())
        .toEqual('41 - Unauthorised filming / recording on test');
    });
  });

});

import {
  ComponentFixture, TestBed, waitForAsync,
} from '@angular/core/testing';
import { CanWaitingRoomDeactivateGuard } from '@pages/waiting-room/can-waiting-room-deactiviate';
import { ActivatedRouteSnapshot } from '@angular/router';

describe('CanWaitingRoomDeactivateGuard', () => {
  let component: CanWaitingRoomDeactivateGuard;
  let fixture: ComponentFixture<CanWaitingRoomDeactivateGuard>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CanWaitingRoomDeactivateGuard,
      ],
    });

    fixture = TestBed.createComponent(CanWaitingRoomDeactivateGuard);
    component = fixture.componentInstance;
  }));
  describe('canDeactivate', () => {
    it('should return true nextState.url.indexOf(JOURNAL_PAGE) is less than 0', () => {
      expect(component.canDeactivate(null, null, null, {
        get root(): ActivatedRouteSnapshot {
          return undefined;
        },
        toString(): string {
          return '';
        },
        url: 'test',
      })).toEqual(true);
    });
  });
});

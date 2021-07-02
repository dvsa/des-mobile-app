import { TestBed, waitForAsync, ComponentFixture } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { translateServiceMock } from '@shared/mocks/translate';
import { configureTestSuite } from 'ng-bullet';
import { LockScreenIndicator } from '../lock-screen-indicator';

describe('LockScreenIndicator', () => {
  let fixture: ComponentFixture<LockScreenIndicator>;
  let component: LockScreenIndicator;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        LockScreenIndicator,
      ],
      imports: [
        TranslateModule,
      ],
      providers: [
        { provide: TranslateService, useValue: translateServiceMock },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(LockScreenIndicator);
    component = fixture.componentInstance;
  }));
  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });
});

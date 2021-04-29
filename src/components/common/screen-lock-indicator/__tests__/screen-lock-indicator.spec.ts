import { TestBed, async, ComponentFixture } from '@angular/core/testing';
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

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LockScreenIndicator);
    component = fixture.componentInstance;
  }));
  describe('Class', () => {
    // Unit tests for the components TypeScript class
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });
});

import { TestBed, waitForAsync, ComponentFixture } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { translateServiceMock } from '@shared/helpers/__mocks__/translate.mock';
import { LockScreenIndicator } from '../lock-screen-indicator';

describe('LockScreenIndicator', () => {
  let fixture: ComponentFixture<LockScreenIndicator>;
  let component: LockScreenIndicator;

  beforeEach(waitForAsync(() => {
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

    fixture = TestBed.createComponent(LockScreenIndicator);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });
});

import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { ErrorMessageComponent, additionalText } from '../error-message';
import { ErrorTypes } from '../../../../app/shared/models/error-message';

describe('ErrorMessageComponent', () => {
  let fixture: ComponentFixture<ErrorMessageComponent>;
  let component: ErrorMessageComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorMessageComponent],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('ngOnInit', () => {
      it('should set the correct properties if the error is JOURNAL_REFRESH', () => {
        component.returnTo = ErrorTypes.JOURNAL_REFRESH;
        fixture.detectChanges();
        component.ngOnInit();
        expect(component.additionalText).toEqual(additionalText.JOURNAL);
        expect(component.redirectLinkText).toEqual(ErrorTypes.JOURNAL_REFRESH);
        expect(component.adviceToUsePaperTest).toEqual(false);
      });
      it('should set the correct properties if the error is JOURNAL_DATA_MISSING', () => {
        component.returnTo = ErrorTypes.JOURNAL_DATA_MISSING;
        fixture.detectChanges();
        component.ngOnInit();
        expect(component.additionalText).toEqual(additionalText.STANDARD_TEXT);
        expect(component.redirectLinkText).toEqual('Dashboard');
        expect(component.adviceToUsePaperTest).toEqual(true);
      });
      it('should set the correct properties if the error is something else', () => {
        component.returnTo = 'RandomPage';
        fixture.detectChanges();
        component.ngOnInit();
        expect(component.additionalText).toEqual(additionalText.STANDARD_TEXT);
        expect(component.redirectLinkText).toEqual('RandomPage');
        expect(component.adviceToUsePaperTest).toEqual(false);
      });
    });
  });
});

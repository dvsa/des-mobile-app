import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { Location } from '@angular/common';
import { ErrorTypes } from '@shared/models/error-message';
import { ErrorMessageComponent, additionalText } from '../error-message';

describe('ErrorMessageComponent', () => {
  let fixture: ComponentFixture<ErrorMessageComponent>;
  let component: ErrorMessageComponent;
  let location: Location;
  const locationSpy = jasmine.createSpyObj('Location', ['back']);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorMessageComponent],
      providers: [
        { provide: Location, useValue: locationSpy },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;

    location = TestBed.inject(Location);
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
      it('should set defaultErrorStatement to indicate no results for today or tomorrow', () => {
        component.returnTo = ErrorTypes.TEST_CENTRE_JOURNAL_NO_RESULT;
        fixture.detectChanges();
        component.ngOnInit();
        expect(component.defaultErrorStatement)
          // eslint-disable-next-line max-len
          .toEqual('You are either not deployed into a test centre, or there are no test bookings at this location for today and tomorrow');
      });
      it('should set additionalText to a message refering to refreshing', () => {
        component.returnTo = ErrorTypes.TEST_CENTRE_JOURNAL_ERROR;
        fixture.detectChanges();
        component.ngOnInit();
        expect(component.additionalText).toEqual(additionalText.TRY_REFRESHING);
        expect(component.redirectLinkText).toEqual('Dashboard');
      });
      it('should set defaultErrorStatement to indicate app id currently offline', () => {
        component.returnTo = ErrorTypes.TEST_CENTRE_OFFLINE;
        fixture.detectChanges();
        component.ngOnInit();
        expect(component.defaultErrorStatement)
          .toEqual('To view the Test Centre Journal please refresh once you are back online.');
        expect(component.redirectLinkText).toEqual('Dashboard');
      });
      it('should set the redirectLinkText to Dashboard when unknown error via test centre', () => {
        component.returnTo = ErrorTypes.TEST_CENTRE_UNKNOWN_ERROR;
        fixture.detectChanges();
        component.ngOnInit();
        expect(component.redirectLinkText).toEqual('Dashboard');
      });
    });
    describe('navigateBack', () => {
      it('should call the back method from Location to navigate back', () => {
        spyOn(location, 'back');
        component.navigateBack();
        expect(location.back).toHaveBeenCalled();
      });
    });
    describe('dismiss', () => {
      it('should call emit from exitModal when dismiss is called', () => {
        spyOn(component.exitModal, 'emit');
        component.dismiss();
        expect(component.exitModal.emit).toHaveBeenCalled();
      });
    });
  });
});

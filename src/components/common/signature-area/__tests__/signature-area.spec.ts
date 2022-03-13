import { SignaturePad } from 'angular2-signaturepad';
import { TestBed, waitForAsync, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { SignatureAreaComponent } from '../signature-area';

class TestStore {
}

describe('SignatureAreaComponent', () => {
  let fixture: ComponentFixture<SignatureAreaComponent>;
  let component: SignatureAreaComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        SignatureAreaComponent,
        MockComponent(SignaturePad),
      ],
      imports: [
        IonicModule,
      ],
      providers: [
        {
          provide: Store,
          useClass: TestStore,
        },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(SignatureAreaComponent);
    component = fixture.componentInstance;
    /* eslint-disable*/
    component.signaturePad = {
      fromDataURL(dataURL: string, options?: any) {
      },
      toDataURL(imageType?: string, quality?: number): string {
        return 'dummyString';
      },
      clear() {
      },
    } as SignaturePad;
    /* eslint-enable */
  }));

  describe('Class', () => {
    describe('signature', () => {
      it('setSignature should update the signature property and call signatureDataChangedDispatch', () => {
        spyOn(component, 'signatureDataChangedDispatch');
        component.signature = undefined;
        component.setSignature('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyEAAAD');
        expect(component.signature).toEqual('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyEAAAD');
        expect(component.signatureDataChangedDispatch).toHaveBeenCalled();
      });
      it('clear should clear the signature property and call signatureDataClearedDispatch', () => {
        spyOn(component, 'signatureDataClearedDispatch');
        component.signature = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyEAAAD';
        component.clear();
        expect(component.signature).toBeNull();
        expect(component.signatureDataClearedDispatch).toHaveBeenCalled();
      });
      it('drawComplete should call signatureDataChangedDispatch', () => {
        spyOn(component, 'signatureDataChangedDispatch');
        component.drawComplete();
        expect(component.signatureDataChangedDispatch).toHaveBeenCalled();
      });
    });
  });

  describe('DOM', () => {
    describe('signHereText ', () => {
      it('sign line text should equal the signHereText property', () => {
        component.signHereText = 'sign here for millions';
        fixture.detectChanges();
        const signHereElement: HTMLElement = fixture.debugElement.query(By.css('.sign-here-label')).nativeElement;
        expect(signHereElement.textContent).toEqual('sign here for millions');
      });
      it('sign line text should default when the signHereText property is falsy', () => {
        component.signHereText = undefined;
        fixture.detectChanges();
        const signHereElement: HTMLElement = fixture.debugElement.query(By.css('.sign-here-label')).nativeElement;
        expect(signHereElement.textContent).toEqual('Sign here');
      });
    });

    describe('retryButtonText ', () => {
      it('retry button text should equal the retryButtonText property', () => {
        component.retryButtonText = 'try again';
        fixture.detectChanges();
        const retryButtonElement: HTMLElement = fixture.debugElement.query(
          By.css('#signature-area-retry-button-label'),
        ).nativeElement;
        expect(retryButtonElement.textContent.trim()).toEqual('try again');
      });
      it('retry button text should default when the retryButtonText property is falsy', () => {
        component.retryButtonText = undefined;
        fixture.detectChanges();
        const retryButtonElement: HTMLElement = fixture.debugElement.query(
          By.css('#signature-area-retry-button-label'),
        ).nativeElement;
        expect(retryButtonElement.textContent.trim()).toEqual('Retry');
      });
    });

    describe('image source', () => {
      it('retryImage, when set, should change the retry image source attribute', () => {
        component.retryImage = '/some/path';
        fixture.detectChanges();
        const retryImageElement: HTMLElement = fixture.debugElement.query(
          By.css('#signature-area-retry-icon'),
        ).nativeElement;
        expect(retryImageElement.getAttribute('style'))
          .toEqual('background-image: url("/some/path");');
      });
      it('retryImage, when not set, should default the retry image source attrubute', () => {
        fixture.detectChanges();
        const retryImageElement: HTMLElement = fixture.debugElement.query(
          By.css('#signature-area-retry-icon'),
        ).nativeElement;
        expect(retryImageElement.getAttribute('style'))
          .toEqual('background-image: url("/assets/imgs/waiting-room/retry.png");');
      });
    });
  });
});

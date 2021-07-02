import { By } from '@angular/platform-browser';
import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { IonicModule } from '@ionic/angular';
import { CandidateDeclarationSignedComponent } from '../candidate-declaration';
import { AppModule } from '../../../../../app.module';

describe('CandidateDeclarationSignedComponent', () => {
  let fixture: ComponentFixture<CandidateDeclarationSignedComponent>;
  let component: CandidateDeclarationSignedComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        CandidateDeclarationSignedComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(CandidateDeclarationSignedComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
  }));

  describe('DOM', () => {
    it('should call CandidateDeclarationChanged with Y when signed is pressed', () => {
      spyOn(component, 'candidateDeclarationChanged');
      component.ngOnChanges();
      const declarationSignedRadio = fixture.debugElement.query(By.css('#declaration-signed'));
      declarationSignedRadio.triggerEventHandler('change', { target: { value: 'Y' } });
      fixture.detectChanges();
      expect(component.candidateDeclarationChanged).toHaveBeenCalledWith('Y');
    });
    it('should call CandidateDeclarationChanged with N when not signed is pressed', () => {
      spyOn(component, 'candidateDeclarationChanged');
      component.ngOnChanges();
      const declarationSignedRadio = fixture.debugElement.query(By.css('#declaration-not-signed'));
      declarationSignedRadio.triggerEventHandler('change', { target: { value: 'N' } });
      fixture.detectChanges();
      expect(component.candidateDeclarationChanged).toHaveBeenCalledWith('N');
    });
  });
});

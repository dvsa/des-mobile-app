import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '@app/app.module';
import { ModalResultItemComponent } from '../modal-result-item';

describe('ModalResultItemComponent', () => {
  let fixture: ComponentFixture<ModalResultItemComponent>;
  let component: ModalResultItemComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ModalResultItemComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ModalResultItemComponent);
    component = fixture.componentInstance;
  }));

  describe('getOutcomeIcon', () => {
    it('should return pass image when isPass is true', () => {
      component.isPass = true;
      expect(component.getOutcomeIcon()).toEqual('assets/imgs/greenCorrectAnswer.png');
    });

    it('should return fail image when isPass is false', () => {
      component.isPass = false;
      expect(component.getOutcomeIcon()).toEqual('assets/imgs/redWrongAnswer.png');
    });
  });

  describe('displayScore', () => {
    it('should return a hyphen if score is null', () => {
      expect(component.displayScore(null)).toEqual('0%');
    });

    it('should return a hyphen if score is undefined', () => {
      expect(component.displayScore(undefined)).toEqual('0%');
    });

    it('should return score if score is a number', () => {
      expect(component.displayScore(1)).toEqual('1%');
    });
  });
});

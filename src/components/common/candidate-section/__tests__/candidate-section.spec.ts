import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CandidateSectionComponent } from '@components/common/candidate-section/candidate-section';
import { provideMockStore } from '@ngrx/store/testing';
import { AppComponent } from '@app/app.component';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { TranslateService } from '@ngx-translate/core';
import { translateServiceMock } from '@shared/helpers/__mocks__/translate.mock';

describe('CandidateSectionComponent', () => {
  let fixture: ComponentFixture<CandidateSectionComponent>;
  let component: CandidateSectionComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule],
      providers: [
        provideMockStore({ ...{} }),
        { provide: AppComponent, useClass: MockAppComponent },
        { provide: TranslateService, useValue: translateServiceMock },
      ],
    });

    fixture = TestBed.createComponent(CandidateSectionComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('proceed', () => {
    it('should emit continueClickEvent with true', () => {
      spyOn(component.continueClickEvent, 'emit');
      component.proceed();
      expect(component.continueClickEvent.emit)
        .toHaveBeenCalledWith(true);
    });
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OfficeFooterComponent } from '../office-footer.component';

describe('OfficeFooterComponent', () => {
  let component: OfficeFooterComponent;
  let fixture: ComponentFixture<OfficeFooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OfficeFooterComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(OfficeFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('saveClick', () => {
    it('should emit saveClicked', () => {
      spyOn(component.saveClicked, 'emit');
      component.saveClick();
      expect(component.saveClicked.emit).toHaveBeenCalled();
    });
  });
  describe('submitClick', () => {
    it('should emit submitClicked with the value of delegated', () => {
      spyOn(component.submitClicked, 'emit');
      component.submitClick();
      expect(component.submitClicked.emit).toHaveBeenCalledWith(component.isDelegated);
    });
  });
  describe('continueClick', () => {
    it('should emit continueClicked', () => {
      spyOn(component.continueClicked, 'emit');
      component.continueClick();
      expect(component.continueClicked.emit).toHaveBeenCalled();
    });
  });
});

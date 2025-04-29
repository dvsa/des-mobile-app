import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegistrationWithPreviousMotTextComponent } from '../registration-with-previous-mot-text.component';

describe('RegistrationWithPreviousMotTextComponent', () => {
  let component: RegistrationWithPreviousMotTextComponent;
  let fixture: ComponentFixture<RegistrationWithPreviousMotTextComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), RegistrationWithPreviousMotTextComponent],
    });

    fixture = TestBed.createComponent(RegistrationWithPreviousMotTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('getRegistrationText', () => {
    it('should return the registration number when it exists', () => {
      component.registrationNumber = 'ABC123';
      component.previouslySearchedRegNumbers = ['XYZ789', 'DEF456'];
      expect(component.getRegistrationText()).toBe('ABC123');
    });

    it('should return "Removed" when there are previously searched registration numbers and no current registration number', () => {
      component.registrationNumber = null;
      component.previouslySearchedRegNumbers = ['XYZ789', 'DEF456'];
      expect(component.getRegistrationText()).toBe('Removed');
    });

    it('should return "None" when there are no previously searched registration numbers and no current registration number', () => {
      component.registrationNumber = null;
      component.previouslySearchedRegNumbers = [];
      expect(component.getRegistrationText()).toBe('None');
    });

    it('should return "None" when previously searched registration numbers is undefined and no current registration number', () => {
      component.registrationNumber = null;
      component.previouslySearchedRegNumbers = undefined;
      expect(component.getRegistrationText()).toBe('None');
    });
  });
});

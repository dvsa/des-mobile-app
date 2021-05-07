import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { EventEmitter } from '@angular/core';
import { configureTestSuite } from 'ng-bullet';
import { ConductedLanguageComponent } from '../conducted-language';

describe('ConductedLanguageComponent', () => {
  let fixture: ComponentFixture<ConductedLanguageComponent>;
  let component: ConductedLanguageComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ConductedLanguageComponent,
      ],
      imports: [
        IonicModule,
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ConductedLanguageComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('welshTextSelected', () => {
      it('should emit an event if welsh is selected ', () => {
        // ARRANGE
        component.welshTextSelect = new EventEmitter<void>();
        spyOn(component.welshTextSelect, 'emit');
        component.welshIsSelected = false;
        component.englishIsSelected = true;

        // ACT
        component.welshTextSelected();
        fixture.detectChanges();

        // ASSERT
        expect(component.welshTextSelect.emit).toHaveBeenCalled();
        expect(component.welshIsSelected).toEqual(true);
        expect(component.englishIsSelected).toEqual(false);
      });
    });
    describe('englishTextSelected', () => {
      it('should emit an event if english is selected ', () => {
        // ARRANGE
        component.englishTextSelect = new EventEmitter<void>();
        spyOn(component.englishTextSelect, 'emit');
        component.welshIsSelected = true;
        component.englishIsSelected = false;

        // ACT
        component.englishTextSelected();
        fixture.detectChanges();

        // ASSERT
        expect(component.englishTextSelect.emit).toHaveBeenCalled();
        expect(component.welshIsSelected).toEqual(false);
        expect(component.englishIsSelected).toEqual(true);
      });
    });
  });
  describe('DOM', () => {

  });
});

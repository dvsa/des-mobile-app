import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Adi3DebriefCard } from '@components/common/adi3-debrief-card/adi3-debrief-card';
import { MockComponent } from 'ng-mocks';
import { Adi3DebriefCardBox } from '@components/common/adi3-debrief-card-box/adi3-debrief-card-box';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { translateServiceMock } from '@shared/helpers/__mocks__/translate.mock';

describe('Adi3DebriefCard', () => {
  let fixture: ComponentFixture<Adi3DebriefCard>;
  let component: Adi3DebriefCard;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        Adi3DebriefCard,
        MockComponent(Adi3DebriefCardBox),
      ],
      providers: [
        { provide: TranslateService, useValue: translateServiceMock },
      ],
      imports: [TranslateModule, IonicModule],
    });

    fixture = TestBed.createComponent(Adi3DebriefCard);
    component = fixture.componentInstance;
  }));

  describe('displayGradeDescription', () => {
    ['A', 'B'].forEach((grade) => {
      it(`should return ${grade} when component.grade is set as ${grade}`, () => {
        component.grade = grade;
        expect(component.displayGradeDescription).toEqual(grade);
      });
    });
    it('should return unsatisfactory by default', () => {
      component.grade = 'test';
      expect(component.displayGradeDescription).toEqual('unsatisfactory');
    });
  });
});

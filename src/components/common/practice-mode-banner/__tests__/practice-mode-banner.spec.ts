import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { IonicModule, Config } from '@ionic/angular';
import { ConfigMock } from 'ionic-mocks';
import { configureTestSuite } from 'ng-bullet';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PracticeModeBanner } from '../practice-mode-banner';

describe('PracticeModeBanner', () => {
  let fixture: ComponentFixture<PracticeModeBanner>;
  let component: PracticeModeBanner;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [PracticeModeBanner],
      imports: [
        IonicModule, RouterTestingModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: Config, useFactory: () => ConfigMock.instance() },
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PracticeModeBanner);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('exitPracticeMode', () => {
      it('should take the user back to the root page', () => {
        component.exitPracticeMode();
        expect(routerSpy.navigate).toHaveBeenCalled();
      });
    });
  });
});

import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '@app/app.module';
import { AdvancedSearchComponent } from '../advanced-search';

describe('AdvancedSearchComponent', () => {
  let fixture: ComponentFixture<AdvancedSearchComponent>;
  let component: AdvancedSearchComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdvancedSearchComponent,
      ],
      imports: [
        AppModule,
        IonicModule,
      ],
      providers: [
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(AdvancedSearchComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });
  describe('upperCaseAlphaNum', () => {
    const testItem: any = {
      target: {
        value: '12!abC',
      },
    };
    it('should change the string given to be contain uppercase alphanumeric characters', () => {
      component.upperCaseAlphaNum(testItem);
      expect(testItem.target.value).toEqual('12ABC');
    });
  });
});

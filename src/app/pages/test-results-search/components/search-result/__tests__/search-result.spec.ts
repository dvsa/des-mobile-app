import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AppModule } from '@app/app.module';
import { ActivityCodes } from '@shared/models/activity-codes';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { CompressionProvider } from '@providers/compression/compression';
import { CompressionProviderMock } from '@providers/compression/__mocks__/compression.mock';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { AppComponent } from '@app/app.component';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { FaultSummaryProviderMock } from '@providers/fault-summary/__mocks__/fault-summary.mock';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { SearchResultComponent } from '../search-result';

describe('SearchResultComponent', () => {
  let fixture: ComponentFixture<SearchResultComponent>;
  let component: SearchResultComponent;

  const testResultMock = {
    costCode: 'code',
    testDate: '2000-03-12 12:30:02',
    driverNumber: '1',
    candidateName: {
      title: 'title',
      firstName: 'firstName',
      lastName: 'lastName',
    },
    applicationReference: 123,
    category: TestCategory.B,
    activityCode: ActivityCodes.PASS,
  } as SearchResultTestSchema;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchResultComponent,
      ],
      imports: [
        AppModule,
        IonicModule,
      ],
      providers: [
        { provide: CompressionProvider, useClass: CompressionProviderMock },
        { provide: AppComponent, useClass: MockAppComponent },
        { provide: FaultSummaryProvider, useClass: FaultSummaryProviderMock },
      ],
    });

    fixture = TestBed.createComponent(SearchResultComponent);
    component = fixture.componentInstance;
    component.searchResult = testResultMock;
  }));

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });

  describe('openTestResult', () => {
    it('should display modal', async () => {
      spyOn(component.modalController, 'create').and.returnValue(Promise.resolve({
        present: async () => {
        },
      } as HTMLIonModalElement));
      await component.openTestResult();
      expect(component.modalController.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDate', () => {
    it('should format the date to DD/MM/YYYY', () => {
      expect(component.getDate()).toBe('12/03/2000');
    });
  });

  describe('getName', () => {
    it('should format the name to (title firstname lastName) if there is a title present', () => {
      expect(component.getName()).toBe('title firstName lastName');
    });
    it('should format the name to (firstname lastName) if there is not a title present', () => {
      component.searchResult.candidateName.title = null;
      expect(component.getName()).toBe('firstName lastName');
    });
  });

  describe('getTime', () => {
    it('should format the time to HH:mm', () => {
      expect(component.getTime()).toBe('12:30');
    });
  });

});

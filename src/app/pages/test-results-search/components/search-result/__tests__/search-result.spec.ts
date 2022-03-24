import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';

import { AppComponent } from '@app/app.component';
import { AppModule } from '@app/app.module';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { SearchResultComponent } from '../search-result';

describe('SearchResultComponent', () => {
  let fixture: ComponentFixture<SearchResultComponent>;
  let component: SearchResultComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchResultComponent,
      ],
      imports: [
        AppModule,
        IonicModule,
      ],
      providers: [
        { provide: AppComponent, useClass: MockAppComponent },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(SearchResultComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });

});

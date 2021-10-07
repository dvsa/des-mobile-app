import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';

import {
  InappropriateUseBannerComponent,
} from '@pages/candidate-details/components/inappropriate-use-banner/inappropriate-use-banner';

describe('InappropriateUseBannerComponent', () => {
  let component: InappropriateUseBannerComponent;
  let fixture: ComponentFixture<InappropriateUseBannerComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [InappropriateUseBannerComponent],
      imports: [
        IonicModule],
      providers: [],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(InappropriateUseBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

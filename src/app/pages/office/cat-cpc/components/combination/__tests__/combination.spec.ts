import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AppModule } from '@app/app.module';
import { CombinationComponent } from '../combination';

fdescribe('CombinationComponent', () => {
  let fixture: ComponentFixture<CombinationComponent>;
  let component: CombinationComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CombinationComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
    });

    fixture = TestBed.createComponent(CombinationComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('getCombinationText', () => {
      it('should return the combination code passed in', () => {
        expect(component.getCombinationText('LGV1')).toEqual('LGV1');
      });
      it('should return N/A when null is passed in', () => {
        expect(component.getCombinationText(null)).toEqual('N/A');
      });
    });
  });
});

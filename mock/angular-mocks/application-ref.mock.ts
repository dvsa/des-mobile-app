import { of } from 'rxjs';

export class ApplicationRefMock {
  tick = jasmine.createSpy('tick');

  isStable = jasmine.createSpy('isStable').and.returnValue(of(true));
}

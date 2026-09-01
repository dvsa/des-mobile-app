import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UppercaseDirective } from '@directives/uppercase.directive';

@Component({
  template: '<input type="text" uppercase>',
  standalone: false,
})
class TestUpperCaseComponent {}

@Component({
  template: '<input type="number" uppercase>',
  standalone: false,
})
class TestNumberOnlyComponent {}

describe('Directive: UppercaseDirective', () => {
  let fixture: ComponentFixture<TestUpperCaseComponent>;
  let fixtureNumber: ComponentFixture<TestNumberOnlyComponent>;
  let inputElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestUpperCaseComponent, UppercaseDirective],
    });
    fixture = TestBed.createComponent(TestUpperCaseComponent);
    fixtureNumber = TestBed.createComponent(TestNumberOnlyComponent);
  });
  it('should upper case input', () => {
    fixture.detectChanges();
    inputElement = fixture.debugElement.query(By.css('input'));
    inputElement.nativeElement.value = 'abc123AAA';
    inputElement.nativeElement.dispatchEvent(new Event('input'));
    expect(inputElement.nativeElement.value).toEqual('ABC123AAA');
  });
  it('should not affect number only input', () => {
    fixtureNumber.detectChanges();
    inputElement = fixtureNumber.debugElement.query(By.css('input'));
    inputElement.nativeElement.value = '123123123';
    inputElement.nativeElement.dispatchEvent(new Event('input'));
    expect(inputElement.nativeElement.value).toEqual('123123123');
  });
});

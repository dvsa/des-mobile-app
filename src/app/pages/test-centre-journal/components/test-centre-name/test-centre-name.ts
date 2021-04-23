import { Component, Input, OnInit } from '@angular/core';
import { TestCentreDetailResponse } from '@shared/models/test-centre-journal.model';

@Component({
  selector: 'test-centre-name',
  templateUrl: 'test-centre-name.html',
  styleUrls: ['test-centre-name.scss'],
})
export class TestCentreNameComponent implements OnInit {

  @Input()
  testCentreResults: TestCentreDetailResponse;

  ngOnInit(): void {
    console.log(this.testCentreResults);
  }

}

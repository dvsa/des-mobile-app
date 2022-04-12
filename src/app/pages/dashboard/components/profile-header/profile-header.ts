import { Component, Input } from '@angular/core';

@Component({
  selector: 'profile-header',
  templateUrl: 'profile-header.html',
  styleUrls: ['profile-header.scss'],
})
export class ProfileHeaderComponent {

  @Input()
  name: string;

  @Input()
  role: string;

  @Input()
  employeeId: string;

  @Input()
  disableASAM: () => void;

}

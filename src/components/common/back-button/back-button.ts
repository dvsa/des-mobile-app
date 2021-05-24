import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'mes-back-button',
  templateUrl: 'back-button.html',
  styleUrls: ['./back-button.scss'],
})
export class MesBackButtonComponent {

  public buttonDisabled = false;

  constructor(
    private location: Location,
  ) { }

  public async onClick(event: Event) {
    this.buttonDisabled = true;
    this.location.back();
    event.preventDefault();
  }

}

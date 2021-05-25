import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mes-back-button',
  templateUrl: 'mes-back-button.html',
  styleUrls: ['./mes-back-button.scss'],
})
export class MesBackButtonComponent {

  @Input()
  public routerLink: string;
  public buttonDisabled = false;

  constructor(
    private router: Router,
  ) { }

  public async onClick(event: Event) {
    this.buttonDisabled = true;
    await this.router.navigate([this.routerLink]);
    event.preventDefault();
  }

}

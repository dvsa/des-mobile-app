import { Component, Input } from '@angular/core';

@Component({
	selector: 'vehicle-details',
	templateUrl: 'vehicle-details.html',
	styleUrls: ['vehicle-details.scss'],
})
export class VehicleDetailsComponent {
	@Input()
	length: number;
	@Input()
	width: number;
	@Input()
	height: number;
	@Input()
	seats: number;
	@Input()
	transmission: string;
	@Input()
	showNumberOfSeats: boolean;
}

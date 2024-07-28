import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { UrlProvider } from '@providers/url/url';
import { VehicleDetails } from '@providers/vehicle-details-api/vehicle-details-api.model';
import { of } from 'rxjs';
import { tap, timeout } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class VehicleDetailsApiService {
	constructor(
		private http: HttpClient,
		private urlProvider: UrlProvider,
		public appConfig: AppConfigProvider
	) {}

	vehicleIdentifier: string;
	vehicleDetailsResponse: VehicleDetails;

	getVehicleByIdentifier(vehicleRegistration: string) {
		if (vehicleRegistration === this.vehicleIdentifier && this.vehicleDetailsResponse !== undefined) {
			return of(this.vehicleDetailsResponse);
		}

		const headers = new HttpHeaders().set('x-api-key', this.urlProvider.getTaxMotApiKey());
		const params = new HttpParams().set('identifier', vehicleRegistration);

		return this.http.get(this.urlProvider.getTaxMotUrl(), { headers, params }).pipe(
			tap((response: VehicleDetails) => {
				this.vehicleIdentifier = vehicleRegistration;
				this.vehicleDetailsResponse = response;
			}),
			timeout(this.appConfig.getAppConfig().requestTimeout)
		);
	}

	/**
	 * Reset cached vehicle values
	 */
	clearVehicleData(): void {
		this.vehicleIdentifier = null;
		this.vehicleDetailsResponse = undefined;
	}
}

import { GoogleAnalytics } from '@awesome-cordova-plugins/google-analytics/ngx';
import { Injectable } from '@angular/core';

@Injectable()
export class GoogleAnalyticsMock extends GoogleAnalytics {
    startTrackerWithId(id: string, interval?: number): Promise<any> {
        return super.startTrackerWithId(id, interval);
    }

    setUserId(id: string): Promise<any> {
        return super.setUserId(id);
    }
}

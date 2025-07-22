import { createAction } from '@ngrx/store';

export const StartHourAmended = createAction('[Change Start and End Time] Start Hour Amended');
export const StartMinuteAmended = createAction('[Change Start and End Time] Start Minute Amended');
export const StartHourArrowsToggled = createAction('[Change Start and End Time] Start Hour Arrows Toggled');
export const StartMinuteArrowsToggled = createAction('[Change Start and End Time] Start Minute Arrows Toggled');

export const EndHourAmended = createAction('[Change Start and End Time] End Hour Amended');
export const EndMinuteAmended = createAction('[Change Start and End Time] End Minute Amended');
export const EndHourArrowsToggled = createAction('[Change Start and End Time] End Hour Arrows Toggled');
export const EndMinuteArrowsToggled = createAction('[Change Start and End Time] End Minute Arrows Toggled');

export const EndTimeBeforeStartTime = createAction('[Change Start and End Time] End Time Is Before Start Time');

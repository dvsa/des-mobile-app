import * as moment from 'moment';
import { DurationInputArg1, MomentInput } from 'moment/moment';

export enum Duration {
	YEAR = 'year',
	DAY = 'day',
	HOUR = 'hour',
	MINUTE = 'minute',
	SECOND = 'second',
}

export class DateTime {
	moment: moment.Moment;

	constructor(sourceDateTime?: DateTime | string | Date, inputFormat?: moment.MomentFormatSpecification) {
		if (sourceDateTime === undefined || sourceDateTime === null) {
			this.moment = moment();
		} else if (typeof sourceDateTime === 'string') {
			this.moment = !!inputFormat ? moment(new Date(sourceDateTime), inputFormat) : moment(new Date(sourceDateTime));
		} else if (sourceDateTime instanceof Date) {
			this.moment = moment(sourceDateTime);
		} else {
			this.moment = moment(sourceDateTime.moment);
		}
	}

	static at(sourceDateTime: DateTime | string | Date): DateTime {
		return new DateTime(sourceDateTime);
	}

	add(amount: DurationInputArg1, unit: moment.unitOfTime.DurationConstructor): DateTime {
		this.moment.add(amount, unit);
		return this;
	}

	subtract(amount: number, unit: moment.unitOfTime.DurationConstructor): DateTime {
		this.moment.subtract(amount, unit);
		return this;
	}

	format(formatString: string): string {
		return this.moment.format(formatString);
	}

	day(): number {
		return this.moment.day();
	}

	toString(): string {
		return this.moment.toString();
	}

	toISOString(): string {
		return this.moment.toISOString();
	}

	isAfter(targetDate: MomentInput): boolean {
		return this.moment.isAfter(targetDate);
	}

	diff(targetDate: MomentInput, duration: Duration, precise?: boolean): number {
		return this.moment.diff(targetDate, duration, precise);
	}

	daysDiff(targetDate: DateTime | string | Date): number {
		const date = new DateTime(targetDate);
		const today = this.moment.startOf(Duration.DAY);
		return date.moment.startOf(Duration.DAY).diff(today, Duration.DAY);
	}

	compareDuration(targetDate: DateTime | string | Date, duration: Duration): number {
		if (typeof targetDate === 'string') {
			return moment(targetDate).diff(this.moment, duration);
		}
		return new DateTime(targetDate).moment.diff(this.moment, duration);
	}

	isBefore(targetDate: DateTime | string | Date): boolean {
		const date = new DateTime(targetDate);
		return date.moment.diff(this.moment, Duration.SECOND) > 0;
	}

	static today(): Date {
		return moment().toDate();
	}

	static datePickerInputToString(date: any) {
		return moment()
			.year(date.year)
			.month(date.month - 1)
			.date(date.day)
			.format('YYYY-MM-DD');
	}
}

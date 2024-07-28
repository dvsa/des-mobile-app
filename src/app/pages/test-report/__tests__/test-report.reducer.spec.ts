import { ResetFaultMode, ToggleDangerousFaultMode, ToggleSeriousFaultMode } from '../test-report.actions';
import { initialState, testReportReducer } from '../test-report.reducer';

describe('TestReportReducer reducer', () => {
	describe('TOGGLE_SERIOUS_FAULT_MODE', () => {
		it('should enable serious fault mode', () => {
			const result = testReportReducer(initialState, ToggleSeriousFaultMode());
			expect(result.seriousMode).toEqual(true);
		});
		it('should disable serious fault mode', () => {
			const state = {
				...initialState,
				seriousMode: true,
			};
			const result = testReportReducer(state, ToggleSeriousFaultMode());
			expect(result.seriousMode).toEqual(false);
		});
	});
	describe('TOGGLE_DANGEROUS_FAULT_MODE', () => {
		it('should enable dangerous fault mode', () => {
			const result = testReportReducer(initialState, ToggleDangerousFaultMode());
			expect(result.dangerousMode).toEqual(true);
		});
		it('should disable dangerous fault mode', () => {
			const state = {
				...initialState,
				dangerousMode: true,
			};
			const result = testReportReducer(state, ToggleDangerousFaultMode());
			expect(result.dangerousMode).toEqual(false);
		});
	});

	describe('ResetFaultMode', () => {
		it('should reset values to false', () => {
			const state = {
				...initialState,
				removeFaultMode: true,
				dangerousMode: true,
			};
			const result = testReportReducer(state, ResetFaultMode());
			expect(result.removeFaultMode).toEqual(false);
			expect(result.dangerousMode).toEqual(false);
		});
	});
});

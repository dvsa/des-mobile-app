import { PreTestDeclarations } from '@dvsa/mes-test-schema/categories/common';
import {
	ClearPreTestDeclarations,
	SignatureDataChanged,
	SignatureDataCleared,
	ToggleInsuranceDeclaration,
	ToggleResidencyDeclaration,
} from '../pre-test-declarations.actions';
import { initialState, preTestDeclarationsReducer } from '../pre-test-declarations.reducer';

describe('PreTestDeclarations reducer', () => {
	it('should toggle the residency status when the toggle action is received', () => {
		const result = preTestDeclarationsReducer(initialState, ToggleInsuranceDeclaration());
		expect(result.insuranceDeclarationAccepted).toBe(true);
	});

	it('should toggle the insurance status when the toggle action is received', () => {
		const result = preTestDeclarationsReducer(initialState, ToggleResidencyDeclaration());
		expect(result.residencyDeclarationAccepted).toBe(true);
	});

	it('should set the signature when the SignatureDataChanged action is received', () => {
		const result = preTestDeclarationsReducer(initialState, SignatureDataChanged('ImSomeNewSignatureData'));
		expect(result.preTestSignature).toEqual('ImSomeNewSignatureData');
	});

	it('should clear the signature when the SignatureDataChanged action is received', () => {
		const state: PreTestDeclarations = {
			...initialState,
			preTestSignature: 'SomeSignatureData',
		};
		const result = preTestDeclarationsReducer(state, SignatureDataCleared());
		expect(result.preTestSignature).toEqual('');
	});

	it('should reset the default state when the clear action is received', () => {
		const dirtyState: PreTestDeclarations = {
			insuranceDeclarationAccepted: true,
			residencyDeclarationAccepted: true,
			preTestSignature: 'somesig',
		};

		const result = preTestDeclarationsReducer(dirtyState, ClearPreTestDeclarations());

		expect(result).toEqual(initialState);
	});
});

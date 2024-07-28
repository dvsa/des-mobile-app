import { InstructorRegistrationNumberChanged } from '../instructor-details.actions';
import { instructorDetailsReducer } from '../instructor-details.reducer';

describe('instructor details reducer', () => {
	it('should place the registration number from the change action into the state', () => {
		const result = instructorDetailsReducer({}, InstructorRegistrationNumberChanged(123));
		expect(result.registrationNumber).toBe(123);
	});
});

import { schemaVersionReducer } from '../schema-version.reducer';
import { PopulateTestSchemaVersion } from '../schema-version.actions';

describe('schema version reducer', () => {
  it('should return the test schema version for a test', () => {
    const mockTestSchemaVersion: string = '0.0.1';
    const result = schemaVersionReducer(null, PopulateTestSchemaVersion(mockTestSchemaVersion));

    expect(result).toBe(mockTestSchemaVersion);
  });
});

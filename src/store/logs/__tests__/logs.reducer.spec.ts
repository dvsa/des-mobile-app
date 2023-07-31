import { Log, LogType } from '@shared/models/log.model';
import { LogsModel } from '@store/logs/logs.model';
import { initialState, logsReducer } from '../logs.reducer';
import * as logsActions from '../logs.actions';
import { LoadLogState } from '../logs.actions';

describe('Logs Reducer', () => {
  describe('undefined action', () => {
    it('should return the existing state', () => {
      const action = { type: 'NOOP' } as any;
      const result = logsReducer(undefined, action);

      expect(result)
        .toBe(initialState);
    });
  });
  describe('LoadLogState', () => {
    it('should add a new log to the state', () => {
      const action = LoadLogState({
        payload: [
          { drivingExaminerId: '123' } as Log,
        ],
      });
      const result = logsReducer([] as LogsModel, action);
      expect(result)
        .toEqual([{ drivingExaminerId: '123' }] as LogsModel);
    });
  });
  describe('[GLOBAL] Save Log', () => {
    it('should save a log to state', () => {
      const log = {
        type: LogType.INFO,
        message: 'DE with id: 12345678 - [JournalEffects] Load Journal Success',
        timestamp: Date.now(),
        drivingExaminerId: '1234567',
      };
      const action = logsActions.SaveLog({ payload: log });

      const result = logsReducer(initialState, action);

      expect(result)
        .toEqual([log]);
    });
  });

  describe('[LogsEffects] Send Logs Success', () => {
    const timestamps = [1551872497881, 1551872497882, 1551872497883];
    const lastLog = {
      type: LogType.WARNING,
      message: 'DE with id: 12345678 - [JournalEffects] Load Journal Silent Failure',
      timestamp: timestamps[2],
      drivingExaminerId: '1234567',
    };

    const logs = [
      {
        type: LogType.INFO,
        message: 'DE with id: 12345678 - [JournalEffects] Load Journal Success',
        timestamp: timestamps[0],
        drivingExaminerId: '1234567',
      },
      {
        type: LogType.ERROR,
        message: 'DE with id: 12345678 - [JournalEffects] Load Journal Failure',
        timestamp: timestamps[1],
        drivingExaminerId: '1234567',
      },
      lastLog,
    ];

    it('should delete all logs if every one of them has been sent', () => {
      const state = logs;
      const action = logsActions.SendLogsSuccess({ timestamps });

      const result = logsReducer(state, action);

      expect(result)
        .toEqual([]);
    });

    it('should not delete the logs which have not yet been sent', () => {
      const state = logs;

      // let's say that only the first 2 logs got sent to the logs service
      const action = logsActions.SendLogsSuccess({ timestamps: timestamps.slice(0, 2) });

      const result = logsReducer(state, action);

      expect(result)
        .toEqual([lastLog]);
    });
  });
});

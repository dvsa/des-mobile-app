import { serializeError } from 'serialize-error';

export const serialiseLogMessage = (data: unknown): string => {
  return typeof data === 'string' ? data: JSON.stringify(serializeError(data))
};

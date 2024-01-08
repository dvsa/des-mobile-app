export const serialiseLogMessage = (data: unknown): string => {
  // if data is already a string, leave it alone
  if (typeof data === 'string') {
    return data;
  }

  // if data is an instance of the Error class, then serialise the error - stringify-ing a straight error returns '{}'
  if (data instanceof Error) {
    return JSON.stringify(data, Object.getOwnPropertyNames(data));
  }

  // anything else we assume we can serialise as JSON string
  return JSON.stringify(data);
};

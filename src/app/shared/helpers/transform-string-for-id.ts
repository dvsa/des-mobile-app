export const transformStringForID = (name: string): string => {
  return name.replace(/\s+/g, '-').toLowerCase();
};

export function isNumeric(n: any): boolean {
  return !Number.isNaN(parseFloat(n)) && Number.isFinite(n);
}

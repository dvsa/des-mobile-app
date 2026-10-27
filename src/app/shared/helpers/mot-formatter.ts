export function hasMakeOrModel(vehicleMake: string | undefined, vehicleModel: string | undefined): boolean {
  return !!vehicleMake?.trim() || !!vehicleModel?.trim();
}

export function getMakeAndModel(vehicleMake: string | undefined, vehicleModel: string | undefined): string {
  //Do not show both fields if neither are present
  if (hasMakeOrModel(vehicleMake, vehicleModel)) {
    const make = vehicleMake?.trim() || 'Not found';
    const model = vehicleModel?.trim() || 'Not found';
    return `${make} ${model}`;
  }
  return 'Not found';
}

import { UserExitedApp } from '@dvsa/mes-test-schema/categories/common';

export const getUserHasExitedApp = (userHasExited: UserExitedApp) => userHasExited.exitFlag;
export const getReasonForExitingApp = (vehicleDetails: UserExitedApp) => vehicleDetails.exitReason;

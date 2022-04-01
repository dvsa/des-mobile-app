import { TestData } from '@dvsa/mes-test-schema/categories/common';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';

export const noFaultsMock: TestData = {};

export const dangerousFaultMock: TestData = {
  dangerousFaults: {
    positioningNormalDriving: true,
  },
};

export const seriousFaultMock: TestData = {
  seriousFaults: {
    positioningNormalDriving: true,
  },
};

export const adi2SevenDrivingFaultsMock: CatADI2UniqueTypes.TestData = {
  drivingFaults: {
    useOfMirrorsSignalling: 1,
    useOfMirrorsChangeDirection: 1,
    useOfMirrorsChangeSpeed: 1,
    signalsNecessary: 1,
    signalsCorrectly: 1,
    signalsTimed: 1,
    junctionsApproachSpeed: 1,
  },
  vehicleChecks: {
    dangerousFault: false,
    seriousFault: false,
  },
};

export const sixteenDrivingFaultsMock: TestData = {
  drivingFaults: {
    useOfMirrorsSignalling: 1,
    useOfMirrorsChangeDirection: 1,
    useOfMirrorsChangeSpeed: 1,
    signalsNecessary: 1,
    signalsCorrectly: 1,
    signalsTimed: 1,
    junctionsApproachSpeed: 1,
    junctionsObservation: 1,
    junctionsTurningRight: 1,
    junctionsTurningLeft: 1,
    junctionsCuttingCorners: 1,
    controlsAccelerator: 1,
    controlsClutch: 1,
    judgementOvertaking: 1,
    progressAppropriateSpeed: 1,
    ancillaryControls: 1,
  },
};

export const thirteenDrivingFaultsMock: TestData = {
  drivingFaults: {
    useOfMirrorsSignalling: 1,
    useOfMirrorsChangeDirection: 1,
    useOfMirrorsChangeSpeed: 1,
    signalsNecessary: 1,
    signalsCorrectly: 1,
    signalsTimed: 1,
    junctionsApproachSpeed: 1,
    junctionsObservation: 1,
    junctionsTurningRight: 1,
    junctionsTurningLeft: 1,
    junctionsCuttingCorners: 1,
    controlsAccelerator: 1,
    controlsClutch: 1,
  },
};

export const adi2SevenDrivingFaultsWithDangerousMock: CatADI2UniqueTypes.TestData = {
  drivingFaults: adi2SevenDrivingFaultsMock.drivingFaults,
  dangerousFaults: {
    clearance: true,
  },
  vehicleChecks: {
    dangerousFault: false,
    seriousFault: false,
  },
};

export const sixteenDrivingFaultsWithDangerousMock: TestData = {
  drivingFaults: sixteenDrivingFaultsMock.drivingFaults,
  dangerousFaults: {
    clearance: true,
  },
};

export const thirteenDrivingFaultsWithDangerousMock: TestData = {
  drivingFaults: thirteenDrivingFaultsMock.drivingFaults,
  dangerousFaults: {
    clearance: true,
  },
};

export const adi2SevenDrivingFaultsWithSeriousMock: CatADI2UniqueTypes.TestData = {
  drivingFaults: adi2SevenDrivingFaultsMock.drivingFaults,
  seriousFaults: {
    positioningNormalDriving: true,
  },
  vehicleChecks: {
    dangerousFault: false,
    seriousFault: false,
  },
};

export const sixteenDrivingFaultsWithSeriousMock: TestData = {
  drivingFaults: sixteenDrivingFaultsMock.drivingFaults,
  seriousFaults: {
    positioningNormalDriving: true,
  },
};

export const thirteenDrivingFaultsWithSeriousMock: TestData = {
  drivingFaults: thirteenDrivingFaultsMock.drivingFaults,
  seriousFaults: {
    positioningNormalDriving: true,
  },
};

export const sixDrivingFaultsMock: TestData = {
  drivingFaults: {
    useOfMirrorsSignalling: 1,
    useOfMirrorsChangeDirection: 1,
    useOfMirrorsChangeSpeed: 1,
    signalsNecessary: 1,
    signalsCorrectly: 1,
    signalsTimed: 1,
  },
};

export const fifteenDrivingFaultsMock: TestData = {
  drivingFaults: {
    useOfMirrorsSignalling: 1,
    useOfMirrorsChangeDirection: 1,
    useOfMirrorsChangeSpeed: 1,
    signalsNecessary: 1,
    signalsCorrectly: 1,
    signalsTimed: 1,
    junctionsApproachSpeed: 1,
    junctionsObservation: 1,
    junctionsTurningRight: 1,
    junctionsTurningLeft: 1,
    junctionsCuttingCorners: 1,
    controlsAccelerator: 1,
    controlsClutch: 1,
    judgementOvertaking: 1,
    progressAppropriateSpeed: 1,
  },
};

export const twelveDrivingFaultsMock: TestData = {
  drivingFaults: {
    useOfMirrorsSignalling: 1,
    useOfMirrorsChangeDirection: 1,
    useOfMirrorsChangeSpeed: 1,
    signalsNecessary: 1,
    signalsCorrectly: 1,
    signalsTimed: 1,
    junctionsApproachSpeed: 1,
    junctionsObservation: 1,
    junctionsTurningRight: 1,
    junctionsTurningLeft: 1,
    junctionsCuttingCorners: 1,
    controlsAccelerator: 1,
  },
};

export const adi2SixDrivingFaultsWithDangerousMock: CatADI2UniqueTypes.TestData = {
  drivingFaults: sixDrivingFaultsMock.drivingFaults,
  dangerousFaults: {
    positioningNormalDriving: true,
  },
  vehicleChecks: {
    dangerousFault: false,
    seriousFault: false,
  },
};

export const fifteenDrivingFaultsWithDangerousMock: TestData = {
  drivingFaults: fifteenDrivingFaultsMock.drivingFaults,
  dangerousFaults: {
    positioningNormalDriving: true,
  },
};

export const twelveDrivingFaultsWithDangerousMock: TestData = {
  drivingFaults: twelveDrivingFaultsMock.drivingFaults,
  dangerousFaults: {
    positioningNormalDriving: true,
  },
};

export const adi2SixDrivingFaultsWithSeriousMock: CatADI2UniqueTypes.TestData = {
  drivingFaults: sixDrivingFaultsMock.drivingFaults,
  seriousFaults: {
    positioningNormalDriving: true,
  },
  vehicleChecks: {
    dangerousFault: false,
    seriousFault: false,
  },
};

export const adi2SixDrivingFaultsMock: CatADI2UniqueTypes.TestData = {
  drivingFaults: sixDrivingFaultsMock.drivingFaults,
  vehicleChecks: {
    dangerousFault: false,
    seriousFault: false,
  },
};

export const adi2DangerousVehicleCheckFaultsMock: CatADI2UniqueTypes.TestData = {
  drivingFaults: sixDrivingFaultsMock.drivingFaults,
  vehicleChecks: {
    dangerousFault: true,
    seriousFault: false,
  },
};

export const fifteenDrivingFaultsWithSeriousMock: TestData = {
  drivingFaults: fifteenDrivingFaultsMock.drivingFaults,
  seriousFaults: {
    positioningNormalDriving: true,
  },
};

export const twelveDrivingFaultsWithSeriousMock: TestData = {
  drivingFaults: twelveDrivingFaultsMock.drivingFaults,
  seriousFaults: {
    positioningNormalDriving: true,
  },
};

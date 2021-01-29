export const showMe2DFTellMe2DF = {
  testData: {
    vehicleChecks: {
      tellMeQuestions: [
        { outcome: 'DF' },
        { outcome: 'DF' },
      ],
      showMeQuestions: [
        { outcome: 'DF' },
        { outcome: 'DF' },
      ],
    },
  },
  drivingFaults: 4,
  seriousFaults: 0,
};

export const showMe2DFTellMe3DF = {
  testData: {
    vehicleChecks: {
      tellMeQuestions: [
        { outcome: 'DF' },
        { outcome: 'DF' },
        { outcome: 'DF' },
      ],
      showMeQuestions: [
        { outcome: 'DF' },
        { outcome: 'DF' },
      ],
    },
  },
  drivingFaults: 4,
  seriousFaults: 1,
};

export const showMe1DFTellMe1DF = {
  testData: {
    vehicleChecks: {
      tellMeQuestions: [
        { outcome: 'DF' },
      ],
      showMeQuestions: [
        { outcome: 'DF' },
      ],
    },
  },
  drivingFaults: 1,
  seriousFaults: 1,
};

export const showMe0DFTellMe1DF = {
  testData: {
    vehicleChecks: {
      tellMeQuestions: [
        { outcome: 'DF' },
      ],
      showMeQuestions: [
        { outcome: 'P' },
      ],
    },
  },
  drivingFaults: 1,
  seriousFaults: 0,
};

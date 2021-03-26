import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { AdvanceTestSlot, Deployment, NonTestActivity, TestSlot } from '@dvsa/mes-journal-schema';

import { localJournal } from './generate-local-journal';
import { localNonTestActivities } from './generate-local-journal-non-test-activities';
import { inNext2Days } from './mock-date-utils';

const filterByTestCentreAndDate = <T>(info: T[] = []): T[] => {
  return info.filter((section: TestSlot | NonTestActivity | Deployment | AdvanceTestSlot) => {
    return (
      section.testCentre &&
      inNext2Days(section)
    );
  });
};


const localTestCentreJournal = {
  "staffNumber": "1234567",
  "examiners": [
    {
      "name": "Joe Bloggs",
      "staffNumber": "1234567",
      "journal": {
        ...localJournal.examiner,
        testSlots: filterByTestCentreAndDate( localJournal.testSlots),
        advanceTestSlots: filterByTestCentreAndDate( localJournal.advanceTestSlots),
        nonTestActivities: filterByTestCentreAndDate( localJournal.nonTestActivities),
        deployments: filterByTestCentreAndDate( localJournal.deployments),
      }
    },
    {
      "name": "Homer Simpson",
      "staffNumber": "4362819",
      "journal": {
        ...localNonTestActivities,
        testSlots: filterByTestCentreAndDate( localNonTestActivities.testSlots),
        advanceTestSlots: filterByTestCentreAndDate( localNonTestActivities.advanceTestSlots),
        nonTestActivities: filterByTestCentreAndDate( localNonTestActivities.nonTestActivities),
        deployments: filterByTestCentreAndDate( localNonTestActivities.deployments),
      }
    },
    {
      "name": "Bart Simpson",
      "staffNumber": "2345433",
      "journal": null,
      "error": "Journal not found"
    },
    {
      "name": "John Doe",
      "staffNumber": "8754209",
      "journal": null,
      "error": "Journal decompression error"
    }
  ],
  "testCentres": [
    {
      "name": "TEST CENTRE A",
      "id": 54321
    },
    {
      "name": "TEST CENTRE B",
      "id": 45670
    }
  ]
}

writeFileSync(join(`${dirname(process.argv[1])}`, 'local-test-centre-journal.json'), JSON.stringify(localTestCentreJournal, null, 2));
console.log('Local test centre journal updated');

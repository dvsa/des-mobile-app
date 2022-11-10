import { JournalData } from '@dvsa/mes-test-schema/categories/common';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { CatC1UniqueTypes } from '@dvsa/mes-test-schema/categories/C1';
import { CatCEUniqueTypes } from '@dvsa/mes-test-schema/categories/CE';
import { CatC1EUniqueTypes } from '@dvsa/mes-test-schema/categories/C1E';
import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { CatD1UniqueTypes } from '@dvsa/mes-test-schema/categories/D1';
import { CatDEUniqueTypes } from '@dvsa/mes-test-schema/categories/DE';
import { CatD1EUniqueTypes } from '@dvsa/mes-test-schema/categories/D1E';

import { CatFUniqueTypes } from '@dvsa/mes-test-schema/categories/F';
import { CatGUniqueTypes } from '@dvsa/mes-test-schema/categories/G';
import { CatHUniqueTypes } from '@dvsa/mes-test-schema/categories/H';
import { CatKUniqueTypes } from '@dvsa/mes-test-schema/categories/K';

export type JournalDataUnion =
 JournalData |
 CatCUniqueTypes.JournalData |
 CatC1UniqueTypes.JournalData |
 CatCEUniqueTypes.JournalData |
 CatC1EUniqueTypes.JournalData |
 CatDUniqueTypes.JournalData |
 CatD1UniqueTypes.JournalData |
 CatDEUniqueTypes.JournalData |
 CatD1EUniqueTypes.JournalData |
 CatFUniqueTypes.JournalData |
 CatGUniqueTypes.JournalData |
 CatHUniqueTypes.JournalData |
 CatKUniqueTypes.JournalData;

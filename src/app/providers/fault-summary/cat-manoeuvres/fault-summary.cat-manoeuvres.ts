import { endsWith, forOwn, transform } from 'lodash';
import { CommentSource, CompetencyIdentifiers, FaultSummary } from '@shared/models/fault-marking.model';
import { CompetencyDisplayName } from '@shared/models/competency-display-name';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { getCompetencyComment } from '@shared/helpers/get-competency-faults';
import { manoeuvreCompetencyLabelsCatC, manoeuvreTypeLabelsCatC } from '@shared/constants/competencies/catc-manoeuvres';
import { CatManoeuvreTestData } from '@shared/unions/test-schema-unions';
import { Manoeuvres } from '@dvsa/mes-test-schema/categories/CM/partial';
import { Manoeuvre } from '@dvsa/mes-test-schema/categories/common';

export class FaultSummaryCatManoeuvreHelper {

  public static getSeriousFaultsNonTrailer(data: CatManoeuvreTestData): FaultSummary[] {
    if (!data) {
      return [];
    }
    return [
      ...this.getManoeuvreFaultsCatManoeuvre(data.manoeuvres, CompetencyOutcome.S),
    ];
  }

  public static getDangerousFaultsNonTrailer(data: CatManoeuvreTestData): FaultSummary[] {
    if (!data) {
      return [];
    }
    return [
      ...this.getManoeuvreFaultsCatManoeuvre(data.manoeuvres, CompetencyOutcome.D),
    ];
  }

  public static getSeriousFaultsTrailer(data: CatManoeuvreTestData): FaultSummary[] {
    if (!data) {
      return [];
    }
    return [
      ...this.getManoeuvreFaultsCatManoeuvre(data.manoeuvres, CompetencyOutcome.S),
      ...this.getUncoupleRecoupleFault(data.uncoupleRecouple, CompetencyOutcome.S),
    ];
  }

  public static getDangerousFaultsTrailer(data: CatManoeuvreTestData): FaultSummary[] {
    if (!data) {
      return [];
    }
    return [
      ...this.getManoeuvreFaultsCatManoeuvre(data.manoeuvres, CompetencyOutcome.D),
      ...this.getUncoupleRecoupleFault(data.uncoupleRecouple, CompetencyOutcome.D),
    ];
  }

  private static createManoeuvreFaultCatManoeuvre(
    key: string,
    type: ManoeuvreTypes,
    competencyComment: string,
  ): FaultSummary {
    const manoeuvreFaultSummary: FaultSummary = {
      comment: competencyComment || '',
      competencyIdentifier: `${type}${manoeuvreCompetencyLabelsCatC[key]}`,
      competencyDisplayName: `${manoeuvreTypeLabelsCatC[type]} - ${manoeuvreCompetencyLabelsCatC[key]}`,
      source: `${CommentSource.MANOEUVRES}-${type}-${manoeuvreCompetencyLabelsCatC[key]}`,
      faultCount: 1,
    };
    return manoeuvreFaultSummary;
  }

  private static getManoeuvreFaultsCatManoeuvre(manoeuvres: Manoeuvres, faultType: CompetencyOutcome): FaultSummary[] {
    if (!manoeuvres) {
      return [];
    }

    const faultsEncountered: FaultSummary[] = [];

    forOwn(manoeuvres, (manoeuvre: Manoeuvre, type: ManoeuvreTypes) => {
      const faults = !manoeuvre.selected ? [] : transform(manoeuvre, (result, value, key: string) => {

        if (endsWith(key, CompetencyIdentifiers.FAULT_SUFFIX) && value === faultType) {

          const competencyComment = getCompetencyComment(
            key,
            manoeuvre.controlFaultComments,
            manoeuvre.observationFaultComments,
          );

          result.push(this.createManoeuvreFaultCatManoeuvre(key, type, competencyComment));
        }
      }, []);
      faultsEncountered.push(...faults);
    });
    return faultsEncountered;
  }

  private static getUncoupleRecoupleFault(uncoupleRecouple: any, faultType: CompetencyOutcome): FaultSummary[] {
    const returnCompetencies = [];
    if (!uncoupleRecouple || uncoupleRecouple.fault !== faultType) {
      return returnCompetencies;
    }
    const result: FaultSummary = {
      competencyDisplayName: CompetencyDisplayName.UNCOUPLE_RECOUPLE,
      competencyIdentifier: 'uncoupleRecouple',
      comment: uncoupleRecouple.faultComments || '',
      source: CommentSource.UNCOUPLE_RECOUPLE,
      faultCount: 1,
    };
    returnCompetencies.push(result);
    return returnCompetencies;
  }

}

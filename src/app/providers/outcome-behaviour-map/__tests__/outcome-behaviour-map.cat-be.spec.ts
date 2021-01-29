import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { OutcomeBehaviourMapProvider } from '../outcome-behaviour-map';
import { behaviourMap } from '../../../pages/office/office-behaviour-map.cat-be';

describe('OutcomeBehaviourMapProvider', () => {
  let outcomeBehaviourMapProvider: OutcomeBehaviourMapProvider;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        OutcomeBehaviourMapProvider,
      ],
    });
  });

  beforeEach(() => {
    outcomeBehaviourMapProvider = TestBed.inject(OutcomeBehaviourMapProvider);
    outcomeBehaviourMapProvider.setBehaviourMap(behaviourMap);
  });

  describe('CAT BE unique outcome testing', () => {
    describe('outcome 1', () => {
      it('should return visibility Y for all fields but eta,faultComment and eco', () => {
        const route = outcomeBehaviourMapProvider.getVisibilityType('1', 'routeNumber');
        const independent = outcomeBehaviourMapProvider.getVisibilityType('1', 'independentDriving');
        const candidate = outcomeBehaviourMapProvider.getVisibilityType('1', 'candidateDescription');
        const debrief = outcomeBehaviourMapProvider.getVisibilityType('1', 'debriefWitnessed');
        const identification = outcomeBehaviourMapProvider.getVisibilityType('1', 'identification');
        const vehicleChecks = outcomeBehaviourMapProvider.getVisibilityType('1', 'vehicleChecks');
        const weather = outcomeBehaviourMapProvider.getVisibilityType('1', 'weatherConditions');
        const d255 = outcomeBehaviourMapProvider.getVisibilityType('1', 'd255');
        const additional = outcomeBehaviourMapProvider.getVisibilityType('1', 'additionalInformation');

        expect(route).toBe('Y');
        expect(independent).toBe('Y');
        expect(candidate).toBe('Y');
        expect(debrief).toBe('Y');
        expect(identification).toBe('Y');
        expect(vehicleChecks).toBe('Y');
        expect(weather).toBe('Y');
        expect(d255).toBe('Y');
        expect(additional).toBe('Y');
      });

      it('should return visibility A for fields eta,faultComment and eco', () => {
        const eta = outcomeBehaviourMapProvider.getVisibilityType('1', 'eta');
        const faultComment = outcomeBehaviourMapProvider.getVisibilityType('1', 'faultComment');
        const eco = outcomeBehaviourMapProvider.getVisibilityType('1', 'eco');

        expect(eta).toBe('A');
        expect(faultComment).toBe('A');
        expect(eco).toBe('A');
      });
    });
  });

  describe('outcome testing', () => {
    describe('outcome 3', () => {
      it('should return visibility Y for candidate, debrief, identification, weather, d255 and additionalInfo', () => {
        const candidate = outcomeBehaviourMapProvider.getVisibilityType('3', 'candidateDescription');
        const debrief = outcomeBehaviourMapProvider.getVisibilityType('3', 'debriefWitnessed');
        const identification = outcomeBehaviourMapProvider.getVisibilityType('3', 'identification');
        const weather = outcomeBehaviourMapProvider.getVisibilityType('3', 'weatherConditions');
        const d255 = outcomeBehaviourMapProvider.getVisibilityType('3', 'd255');
        const additional = outcomeBehaviourMapProvider.getVisibilityType('3', 'additionalInformation');

        expect(candidate).toBe('Y');
        expect(debrief).toBe('Y');
        expect(identification).toBe('Y');
        expect(weather).toBe('Y');
        expect(d255).toBe('Y');
        expect(additional).toBe('Y');
      });

      it('should return visibility N for fields routeNumber, independentDriving and showMeQuestion ', () => {
        const route = outcomeBehaviourMapProvider.getVisibilityType('3', 'routeNumber');
        const independent = outcomeBehaviourMapProvider.getVisibilityType('3', 'independentDriving');

        expect(route).toBe('N');
        expect(independent).toBe('N');
      });

      it('should return visibility A for fields eta,faultComment and eco', () => {
        const eta = outcomeBehaviourMapProvider.getVisibilityType('3', 'eta');
        const faultComment = outcomeBehaviourMapProvider.getVisibilityType('3', 'faultComment');
        const eco = outcomeBehaviourMapProvider.getVisibilityType('3', 'eco');
        const vehicleChecks = outcomeBehaviourMapProvider.getVisibilityType('3', 'vehicleChecks');

        expect(eta).toBe('A');
        expect(faultComment).toBe('A');
        expect(eco).toBe('A');
        expect(vehicleChecks).toBe('A');
      });

      it('should return default value of YES for d255', () => {
        const d255 = outcomeBehaviourMapProvider.getDefault('3', 'd255');
        expect(d255).toBe('Yes');
      });
    });
    describe('outcome 4', () => {
      it('should return visibility Y for all fields but eta,faultComment and eco', () => {
        const route = outcomeBehaviourMapProvider.getVisibilityType('4', 'routeNumber');
        const independent = outcomeBehaviourMapProvider.getVisibilityType('4', 'independentDriving');
        const candidate = outcomeBehaviourMapProvider.getVisibilityType('4', 'candidateDescription');
        const debrief = outcomeBehaviourMapProvider.getVisibilityType('4', 'debriefWitnessed');
        const identification = outcomeBehaviourMapProvider.getVisibilityType('4', 'identification');
        const vehicleChecks = outcomeBehaviourMapProvider.getVisibilityType('4', 'vehicleChecks');
        const weather = outcomeBehaviourMapProvider.getVisibilityType('4', 'weatherConditions');
        const d255 = outcomeBehaviourMapProvider.getVisibilityType('4', 'd255');
        const additional = outcomeBehaviourMapProvider.getVisibilityType('4', 'additionalInformation');

        expect(route).toBe('Y');
        expect(independent).toBe('Y');
        expect(candidate).toBe('Y');
        expect(debrief).toBe('Y');
        expect(identification).toBe('Y');
        expect(vehicleChecks).toBe('A');
        expect(weather).toBe('Y');
        expect(d255).toBe('Y');
        expect(additional).toBe('Y');
      });

      it('should return visibility A for fields eta,faultComment and eco', () => {
        const eta = outcomeBehaviourMapProvider.getVisibilityType('4', 'eta');
        const faultComment = outcomeBehaviourMapProvider.getVisibilityType('4', 'faultComment');
        const eco = outcomeBehaviourMapProvider.getVisibilityType('4', 'eco');

        expect(eta).toBe('A');
        expect(faultComment).toBe('A');
        expect(eco).toBe('A');
      });
      it('should return showNotApplicable true for fields independentDriving', () => {
        const independent = outcomeBehaviourMapProvider.showNotApplicable('4', 'independentDriving');

        expect(independent).toEqual(true);
      });
    });
    describe('outcome 11', () => {
      it('should return visibility Y for all fields but eta,faultComment, vehicleChecks and eco', () => {
        const route = outcomeBehaviourMapProvider.getVisibilityType('11', 'routeNumber');
        const independent = outcomeBehaviourMapProvider.getVisibilityType('11', 'independentDriving');
        const candidate = outcomeBehaviourMapProvider.getVisibilityType('11', 'candidateDescription');
        const debrief = outcomeBehaviourMapProvider.getVisibilityType('11', 'debriefWitnessed');
        const identification = outcomeBehaviourMapProvider.getVisibilityType('11', 'identification');
        const weather = outcomeBehaviourMapProvider.getVisibilityType('11', 'weatherConditions');
        const d255 = outcomeBehaviourMapProvider.getVisibilityType('11', 'd255');
        const additional = outcomeBehaviourMapProvider.getVisibilityType('11', 'additionalInformation');

        expect(route).toBe('Y');
        expect(independent).toBe('Y');
        expect(candidate).toBe('Y');
        expect(debrief).toBe('Y');
        expect(identification).toBe('Y');
        expect(weather).toBe('Y');
        expect(d255).toBe('Y');
        expect(additional).toBe('Y');
      });

      it('should return visibility N for fields eta,faultComment and eco', () => {
        const eta = outcomeBehaviourMapProvider.getVisibilityType('11', 'eta');
        const faultComment = outcomeBehaviourMapProvider.getVisibilityType('11', 'faultComment');
        const eco = outcomeBehaviourMapProvider.getVisibilityType('11', 'eco');

        expect(eta).toBe('N');
        expect(faultComment).toBe('N');
        expect(eco).toBe('N');
      });
      it('should return showNotApplicable true for fields independentDriving', () => {
        const independent = outcomeBehaviourMapProvider.showNotApplicable('11', 'independentDriving');

        expect(independent).toEqual(true);
      });
    });
    describe('outcome 20', () => {
      it('should return visibility Y for candidateDescription and additionalInformation', () => {

        const candidate = outcomeBehaviourMapProvider.getVisibilityType('20', 'candidateDescription');
        const additional = outcomeBehaviourMapProvider.getVisibilityType('20', 'additionalInformation');

        expect(candidate).toBe('Y');
        expect(additional).toBe('Y');
      });

      it('should return visibility N for all other fields', () => {
        const route = outcomeBehaviourMapProvider.getVisibilityType('20', 'routeNumber');
        const independent = outcomeBehaviourMapProvider.getVisibilityType('20', 'independentDriving');
        const debrief = outcomeBehaviourMapProvider.getVisibilityType('20', 'debriefWitnessed');
        const identification = outcomeBehaviourMapProvider.getVisibilityType('20', 'identification');
        const vehicleChecks = outcomeBehaviourMapProvider.getVisibilityType('20', 'vehicleChecks');
        const weather = outcomeBehaviourMapProvider.getVisibilityType('20', 'weatherConditions');
        const d255 = outcomeBehaviourMapProvider.getVisibilityType('20', 'd255');
        const eta = outcomeBehaviourMapProvider.getVisibilityType('20', 'eta');
        const faultComment = outcomeBehaviourMapProvider.getVisibilityType('20', 'faultComment');
        const eco = outcomeBehaviourMapProvider.getVisibilityType('20', 'eco');

        expect(route).toBe('N');
        expect(independent).toBe('N');
        expect(debrief).toBe('N');
        expect(identification).toBe('N');
        expect(vehicleChecks).toBe('N');
        expect(weather).toBe('N');
        expect(d255).toBe('N');
        expect(eta).toBe('N');
        expect(faultComment).toBe('N');
        expect(eco).toBe('N');
      });
    });

    describe('outcome 21', () => {
      it('should return visibility Y for candidateDescription,additionalInformation,identification, weather and d255',
        () => {
          const candidate = outcomeBehaviourMapProvider.getVisibilityType('21', 'candidateDescription');
          const additional = outcomeBehaviourMapProvider.getVisibilityType('21', 'additionalInformation');
          const identification = outcomeBehaviourMapProvider.getVisibilityType('21', 'identification');
          const weather = outcomeBehaviourMapProvider.getVisibilityType('21', 'weatherConditions');
          const d255 = outcomeBehaviourMapProvider.getVisibilityType('21', 'd255');

          expect(candidate).toBe('Y');
          expect(additional).toBe('Y');
          expect(identification).toBe('Y');
          expect(weather).toBe('Y');
          expect(d255).toBe('Y');
        });

      it('should return visibility A for vehicleChecks', () => {
        const vehicleChecks = outcomeBehaviourMapProvider.getVisibilityType('21', 'vehicleChecks');
        expect(vehicleChecks).toBe('A');
      });

      it('should return visibility N for all other fields', () => {
        const route = outcomeBehaviourMapProvider.getVisibilityType('21', 'routeNumber');
        const independent = outcomeBehaviourMapProvider.getVisibilityType('21', 'independentDriving');
        const debrief = outcomeBehaviourMapProvider.getVisibilityType('21', 'debriefWitnessed');
        const eta = outcomeBehaviourMapProvider.getVisibilityType('21', 'eta');
        const faultComment = outcomeBehaviourMapProvider.getVisibilityType('21', 'faultComment');
        const eco = outcomeBehaviourMapProvider.getVisibilityType('21', 'eco');

        expect(route).toBe('N');
        expect(independent).toBe('N');
        expect(debrief).toBe('N');
        expect(eta).toBe('N');
        expect(faultComment).toBe('N');
        expect(eco).toBe('N');
      });
    });

    describe('outcome 22', () => {

      it('should return showNotApplicable true for independent driving', () => {
        const independent = outcomeBehaviourMapProvider.showNotApplicable('22', 'independentDriving');
        expect(independent).toEqual(true);
      });

      it('should return visibility A for vehicleChecks', () => {
        const vehicleChecks = outcomeBehaviourMapProvider.getVisibilityType('22', 'vehicleChecks');
        expect(vehicleChecks).toBe('A');
      });

      it('should return visibility N for eta, eco and faultComment fields', () => {
        const eta = outcomeBehaviourMapProvider.getVisibilityType('22', 'eta');
        const faultComment = outcomeBehaviourMapProvider.getVisibilityType('22', 'faultComment');
        const eco = outcomeBehaviourMapProvider.getVisibilityType('22', 'eco');

        expect(eta).toBe('N');
        expect(faultComment).toBe('N');
        expect(eco).toBe('N');
      });
      it('should return visibility Y for all other fields', () => {
        const route = outcomeBehaviourMapProvider.getVisibilityType('22', 'routeNumber');
        const independent = outcomeBehaviourMapProvider.getVisibilityType('22', 'independentDriving');
        const candidate = outcomeBehaviourMapProvider.getVisibilityType('22', 'candidateDescription');
        const debrief = outcomeBehaviourMapProvider.getVisibilityType('22', 'debriefWitnessed');
        const identification = outcomeBehaviourMapProvider.getVisibilityType('22', 'identification');
        const weather = outcomeBehaviourMapProvider.getVisibilityType('22', 'weatherConditions');
        const d255 = outcomeBehaviourMapProvider.getVisibilityType('22', 'd255');
        const additional = outcomeBehaviourMapProvider.getVisibilityType('22', 'additionalInformation');

        expect(route).toBe('Y');
        expect(independent).toBe('Y');
        expect(candidate).toBe('Y');
        expect(debrief).toBe('Y');
        expect(identification).toBe('Y');
        expect(weather).toBe('Y');
        expect(d255).toBe('Y');
        expect(additional).toBe('Y');

      });
    });

    describe('outcome 23', () => {

      it('should return showNotApplicable true for independent driving', () => {
        const independent = outcomeBehaviourMapProvider.showNotApplicable('23', 'independentDriving');
        expect(independent).toEqual(true);
      });

      it('should return visibility N for eta, eco and faultComment fields', () => {
        const eta = outcomeBehaviourMapProvider.getVisibilityType('23', 'eta');
        const faultComment = outcomeBehaviourMapProvider.getVisibilityType('23', 'faultComment');
        const eco = outcomeBehaviourMapProvider.getVisibilityType('23', 'eco');

        expect(eta).toBe('N');
        expect(faultComment).toBe('N');
        expect(eco).toBe('N');
      });
      it('should return visibility Y or A for all other fields', () => {
        const route = outcomeBehaviourMapProvider.getVisibilityType('23', 'routeNumber');
        const independent = outcomeBehaviourMapProvider.getVisibilityType('23', 'independentDriving');
        const candidate = outcomeBehaviourMapProvider.getVisibilityType('23', 'candidateDescription');
        const debrief = outcomeBehaviourMapProvider.getVisibilityType('23', 'debriefWitnessed');
        const identification = outcomeBehaviourMapProvider.getVisibilityType('23', 'identification');
        const vehicleChecks = outcomeBehaviourMapProvider.getVisibilityType('23', 'vehicleChecks');
        const weather = outcomeBehaviourMapProvider.getVisibilityType('23', 'weatherConditions');
        const d255 = outcomeBehaviourMapProvider.getVisibilityType('23', 'd255');
        const additional = outcomeBehaviourMapProvider.getVisibilityType('23', 'additionalInformation');

        expect(route).toBe('Y');
        expect(independent).toBe('Y');
        expect(candidate).toBe('Y');
        expect(debrief).toBe('Y');
        expect(identification).toBe('Y');
        expect(vehicleChecks).toBe('A');
        expect(weather).toBe('Y');
        expect(d255).toBe('Y');
        expect(additional).toBe('Y');

      });
    });

    describe('outcome 33', () => {

      it('should return visibility A for vehicleChecks', () => {
        const vehicleChecks = outcomeBehaviourMapProvider.getVisibilityType('33', 'vehicleChecks');
        expect(vehicleChecks).toBe('A');
      });

      it('should return visibility Y for candidate,debrief,identification,weather,d255 and additional', () => {
        const candidate = outcomeBehaviourMapProvider.getVisibilityType('33', 'candidateDescription');
        const debrief = outcomeBehaviourMapProvider.getVisibilityType('33', 'debriefWitnessed');
        const identification = outcomeBehaviourMapProvider.getVisibilityType('33', 'identification');
        const weather = outcomeBehaviourMapProvider.getVisibilityType('33', 'weatherConditions');
        const d255 = outcomeBehaviourMapProvider.getVisibilityType('33', 'd255');
        const additional = outcomeBehaviourMapProvider.getVisibilityType('33', 'additionalInformation');

        expect(candidate).toBe('Y');
        expect(debrief).toBe('Y');
        expect(identification).toBe('Y');
        expect(weather).toBe('Y');
        expect(d255).toBe('Y');
        expect(additional).toBe('Y');

      });
      it('should return visibility N for all other fields', () => {
        const route = outcomeBehaviourMapProvider.getVisibilityType('33', 'routeNumber');
        const independent = outcomeBehaviourMapProvider.getVisibilityType('33', 'independentDriving');
        const eta = outcomeBehaviourMapProvider.getVisibilityType('33', 'eta');
        const faultComment = outcomeBehaviourMapProvider.getVisibilityType('33', 'faultComment');
        const eco = outcomeBehaviourMapProvider.getVisibilityType('33', 'eco');

        expect(route).toBe('N');
        expect(independent).toBe('N');
        expect(eta).toBe('N');
        expect(faultComment).toBe('N');
        expect(eco).toBe('N');

      });
    });

    describe('outcome 40', () => {

      it('should return visibility Y for route,candidate,debrief,identification,weather,d255 and additional', () => {
        const route = outcomeBehaviourMapProvider.getVisibilityType('40', 'routeNumber');
        const candidate = outcomeBehaviourMapProvider.getVisibilityType('40', 'candidateDescription');
        const debrief = outcomeBehaviourMapProvider.getVisibilityType('40', 'debriefWitnessed');
        const identification = outcomeBehaviourMapProvider.getVisibilityType('40', 'identification');
        const weather = outcomeBehaviourMapProvider.getVisibilityType('40', 'weatherConditions');
        const d255 = outcomeBehaviourMapProvider.getVisibilityType('40', 'd255');
        const additional = outcomeBehaviourMapProvider.getVisibilityType('40', 'additionalInformation');

        expect(route).toBe('Y');
        expect(candidate).toBe('Y');
        expect(debrief).toBe('Y');
        expect(identification).toBe('Y');
        expect(weather).toBe('Y');
        expect(d255).toBe('Y');
        expect(additional).toBe('Y');

      });
      it('should return visibility N for all other fields', () => {
        const independent = outcomeBehaviourMapProvider.getVisibilityType('40', 'independentDriving');
        const eta = outcomeBehaviourMapProvider.getVisibilityType('40', 'eta');
        const faultComment = outcomeBehaviourMapProvider.getVisibilityType('40', 'faultComment');
        const eco = outcomeBehaviourMapProvider.getVisibilityType('40', 'eco');
        const vehicleChecks = outcomeBehaviourMapProvider.getVisibilityType('40', 'vehicleChecks');

        expect(independent).toBe('N');
        expect(eta).toBe('N');
        expect(faultComment).toBe('N');
        expect(eco).toBe('N');
        expect(vehicleChecks).toBe('N');

      });
    });

    describe('outcome 51', () => {

      it('should return visibility Y for additional information', () => {
        const additional = outcomeBehaviourMapProvider.getVisibilityType('51', 'additionalInformation');

        expect(additional).toBe('Y');

      });
      it('should return visibility N for all other fields', () => {
        const route = outcomeBehaviourMapProvider.getVisibilityType('51', 'routeNumber');
        const candidate = outcomeBehaviourMapProvider.getVisibilityType('51', 'candidateDescription');
        const debrief = outcomeBehaviourMapProvider.getVisibilityType('51', 'debriefWitnessed');
        const identification = outcomeBehaviourMapProvider.getVisibilityType('51', 'identification');
        const weather = outcomeBehaviourMapProvider.getVisibilityType('51', 'weatherConditions');
        const d255 = outcomeBehaviourMapProvider.getVisibilityType('51', 'd255');
        const independent = outcomeBehaviourMapProvider.getVisibilityType('51', 'independentDriving');
        const eta = outcomeBehaviourMapProvider.getVisibilityType('51', 'eta');
        const faultComment = outcomeBehaviourMapProvider.getVisibilityType('51', 'faultComment');
        const eco = outcomeBehaviourMapProvider.getVisibilityType('51', 'eco');
        const vehicleChecks = outcomeBehaviourMapProvider.getVisibilityType('51', 'vehicleChecks');

        expect(route).toBe('N');
        expect(candidate).toBe('N');
        expect(debrief).toBe('N');
        expect(identification).toBe('N');
        expect(weather).toBe('N');
        expect(d255).toBe('N');
        expect(independent).toBe('N');
        expect(eta).toBe('N');
        expect(faultComment).toBe('N');
        expect(eco).toBe('N');
        expect(vehicleChecks).toBe('N');

      });
    });

    describe('outcome 69', () => {

      it('should return visibility Y for candidate,debrief,identification and additionalInformation', () => {
        const candidate = outcomeBehaviourMapProvider.getVisibilityType('69', 'candidateDescription');
        const debrief = outcomeBehaviourMapProvider.getVisibilityType('69', 'debriefWitnessed');
        const identification = outcomeBehaviourMapProvider.getVisibilityType('69', 'identification');
        const additional = outcomeBehaviourMapProvider.getVisibilityType('69', 'additionalInformation');

        expect(candidate).toBe('Y');
        expect(debrief).toBe('Y');
        expect(identification).toBe('Y');
        expect(additional).toBe('Y');

      });
      it('should return visibility N for all other fields', () => {
        const route = outcomeBehaviourMapProvider.getVisibilityType('69', 'routeNumber');
        const weather = outcomeBehaviourMapProvider.getVisibilityType('69', 'weatherConditions');
        const d255 = outcomeBehaviourMapProvider.getVisibilityType('69', 'd255');
        const independent = outcomeBehaviourMapProvider.getVisibilityType('69', 'independentDriving');
        const eta = outcomeBehaviourMapProvider.getVisibilityType('69', 'eta');
        const faultComment = outcomeBehaviourMapProvider.getVisibilityType('69', 'faultComment');
        const eco = outcomeBehaviourMapProvider.getVisibilityType('69', 'eco');
        const vehicleChecks = outcomeBehaviourMapProvider.getVisibilityType('69', 'vehicleChecks');

        expect(route).toBe('N');
        expect(weather).toBe('N');
        expect(d255).toBe('N');
        expect(independent).toBe('N');
        expect(eta).toBe('N');
        expect(faultComment).toBe('N');
        expect(eco).toBe('N');
        expect(vehicleChecks).toBe('N');

      });
    });

  });

});

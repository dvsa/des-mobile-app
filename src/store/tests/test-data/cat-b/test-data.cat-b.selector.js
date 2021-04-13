import { get } from 'lodash';
import { CompetencyOutcome } from '../../../../shared/models/competency-outcome';
import { QuestionProvider } from '../../../../providers/question/question';
export var getDrivingFaultCount = function (data, competency) { return data.drivingFaults[competency]; };
export var getManoeuvres = function (data) { return data.manoeuvres; };
// TODO - We should pass a Manoeuvre object here instead of TestData
export var hasManoeuvreBeenCompletedCatB = function (data) {
    return (get(data.manoeuvres, 'forwardPark.selected') ||
        get(data.manoeuvres, 'reverseParkCarpark.selected') ||
        get(data.manoeuvres, 'reverseParkRoad.selected') ||
        get(data.manoeuvres, 'reverseRight.selected'));
};
export var hasEyesightTestGotSeriousFault = function (data) { return data.eyesightTest.seriousFault; };
export var hasEyesightTestBeenCompleted = function (data) { return data.eyesightTest.complete; };
export var hasLegalRequirementBeenCompleted = function (data, legalRequirement) {
    return data[legalRequirement];
};
export var getVehicleChecks = function (state) { return state.vehicleChecks; };
export var getTellMeQuestion = function (state) {
    var questionProvider = new QuestionProvider();
    return questionProvider
        .getTellMeQuestions("B" /* B */)
        .find(function (question) { return question.code === get(state, 'tellMeQuestion.code'); });
};
export var isTellMeQuestionSelected = function (state) { return get(state, 'tellMeQuestion.code') !== undefined; };
export var isTellMeQuestionCorrect = function (state) { return get(state, 'tellMeQuestion.outcome') === CompetencyOutcome.P; };
export var isTellMeQuestionDrivingFault = function (state) {
    return get(state, 'tellMeQuestion.outcome') === CompetencyOutcome.DF;
};
export var tellMeQuestionOutcome = function (state) { return get(state, 'tellMeQuestion.outcome'); };
export var getSelectedTellMeQuestionText = function (state) {
    var questionProvider = new QuestionProvider();
    var tellMeQuestionText = questionProvider
        .getTellMeQuestions("B" /* B */)
        .find(function (question) { return question.code === get(state, 'tellMeQuestion.code'); });
    if (!tellMeQuestionText) {
        return '';
    }
    return get(state, 'tellMeQuestion.code') + " - " + tellMeQuestionText.shortName;
};
export var getShowMeQuestion = function (state) {
    var questionProvider = new QuestionProvider();
    return questionProvider
        .getShowMeQuestions("B" /* B */)
        .find(function (question) { return question.code === get(state, 'showMeQuestion.code'); });
};
// TODO - We should really pass a Vehicle Checks object here and not Test Data
export var hasVehicleChecksBeenCompletedCatB = function (data) {
    var showMeQuestionOutcome = get(data, 'vehicleChecks.showMeQuestion.outcome', null);
    var tellMeQuestionOutcome = get(data, 'vehicleChecks.tellMeQuestion.outcome', null);
    return (showMeQuestionOutcome != null && tellMeQuestionOutcome != null);
};
//# sourceMappingURL=test-data.cat-b.selector.js.map
export var TELL_ME_QUESTION_SELECTED = '[Vehicle Checks] Tell me question selected';
export var TELL_ME_QUESTION_CORRECT = '[Vehicle Checks] Tell me question correct';
export var TELL_ME_QUESTION_DRIVING_FAULT = '[Vehicle Checks] Tell me question driving fault';
export var ADD_SHOW_ME_TELL_ME_COMMENT = '[Vehicle Checks] Add Show me Tell me comment';
export var SHOW_ME_QUESTION_SELECTED = '[Vehicle Checks] Show me question selected';
export var SHOW_ME_QUESTION_PASSED = '[Vehicle Checks] Show me question passed';
export var SHOW_ME_QUESTION_DRIVING_FAULT = '[Vehicle Checks] Show me question driving fault';
export var SHOW_ME_QUESTION_SERIOUS_FAULT = '[Vehicle Checks] Show me question serious fault';
export var SHOW_ME_QUESTION_DANGEROUS_FAULT = '[Vehicle Checks] Show me question dangerous fault';
export var SHOW_ME_QUESTION_REMOVE_FAULT = '[Vehicle Checks] Show me question remove fault';
export var QuestionOutcomes;
(function (QuestionOutcomes) {
    QuestionOutcomes["Pass"] = "P";
    QuestionOutcomes["DrivingFault"] = "DF";
})(QuestionOutcomes || (QuestionOutcomes = {}));
var TellMeQuestionSelected = /** @class */ (function () {
    function TellMeQuestionSelected(tellMeQuestion) {
        this.tellMeQuestion = tellMeQuestion;
        this.type = TELL_ME_QUESTION_SELECTED;
    }
    return TellMeQuestionSelected;
}());
export { TellMeQuestionSelected };
var TellMeQuestionCorrect = /** @class */ (function () {
    function TellMeQuestionCorrect() {
        this.type = TELL_ME_QUESTION_CORRECT;
    }
    return TellMeQuestionCorrect;
}());
export { TellMeQuestionCorrect };
var TellMeQuestionDrivingFault = /** @class */ (function () {
    function TellMeQuestionDrivingFault() {
        this.type = TELL_ME_QUESTION_DRIVING_FAULT;
    }
    return TellMeQuestionDrivingFault;
}());
export { TellMeQuestionDrivingFault };
var ShowMeQuestionSelected = /** @class */ (function () {
    function ShowMeQuestionSelected(showMeQuestion) {
        this.showMeQuestion = showMeQuestion;
        this.type = SHOW_ME_QUESTION_SELECTED;
    }
    return ShowMeQuestionSelected;
}());
export { ShowMeQuestionSelected };
var ShowMeQuestionPassed = /** @class */ (function () {
    function ShowMeQuestionPassed() {
        this.type = SHOW_ME_QUESTION_PASSED;
    }
    return ShowMeQuestionPassed;
}());
export { ShowMeQuestionPassed };
var ShowMeQuestionSeriousFault = /** @class */ (function () {
    function ShowMeQuestionSeriousFault() {
        this.type = SHOW_ME_QUESTION_SERIOUS_FAULT;
    }
    return ShowMeQuestionSeriousFault;
}());
export { ShowMeQuestionSeriousFault };
var ShowMeQuestionDangerousFault = /** @class */ (function () {
    function ShowMeQuestionDangerousFault() {
        this.type = SHOW_ME_QUESTION_DANGEROUS_FAULT;
    }
    return ShowMeQuestionDangerousFault;
}());
export { ShowMeQuestionDangerousFault };
var ShowMeQuestionDrivingFault = /** @class */ (function () {
    function ShowMeQuestionDrivingFault() {
        this.type = SHOW_ME_QUESTION_DRIVING_FAULT;
    }
    return ShowMeQuestionDrivingFault;
}());
export { ShowMeQuestionDrivingFault };
var ShowMeQuestionRemoveFault = /** @class */ (function () {
    function ShowMeQuestionRemoveFault() {
        this.type = SHOW_ME_QUESTION_REMOVE_FAULT;
    }
    return ShowMeQuestionRemoveFault;
}());
export { ShowMeQuestionRemoveFault };
var AddShowMeTellMeComment = /** @class */ (function () {
    function AddShowMeTellMeComment(comment) {
        this.comment = comment;
        this.type = ADD_SHOW_ME_TELL_ME_COMMENT;
    }
    return AddShowMeTellMeComment;
}());
export { AddShowMeTellMeComment };
//# sourceMappingURL=vehicle-checks.actions.js.map
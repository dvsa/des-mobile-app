var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import * as vehicleChecksActions from './vehicle-checks.actions';
import { CompetencyOutcome } from '../../../../../shared/models/competency-outcome';
export var initialState = {
    tellMeQuestion: {},
    showMeQuestion: {},
};
export function vehicleChecksReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case vehicleChecksActions.TELL_ME_QUESTION_SELECTED:
            return __assign(__assign({}, state), { tellMeQuestion: {
                    code: action.tellMeQuestion.code,
                    description: action.tellMeQuestion.shortName,
                } });
        case vehicleChecksActions.TELL_ME_QUESTION_CORRECT:
            return __assign(__assign({}, state), { tellMeQuestion: __assign(__assign({}, state.tellMeQuestion), { outcome: CompetencyOutcome.P }) });
        case vehicleChecksActions.TELL_ME_QUESTION_DRIVING_FAULT:
            return __assign(__assign({}, state), { tellMeQuestion: __assign(__assign({}, state.tellMeQuestion), { outcome: CompetencyOutcome.DF }) });
        case vehicleChecksActions.SHOW_ME_QUESTION_SELECTED:
            return __assign(__assign({}, state), { showMeQuestion: __assign(__assign({}, state.showMeQuestion), { code: action.showMeQuestion.code, description: action.showMeQuestion.shortName }) });
        case vehicleChecksActions.SHOW_ME_QUESTION_PASSED:
            return __assign(__assign({}, state), { showMeQuestion: __assign(__assign({}, state.showMeQuestion), { outcome: CompetencyOutcome.P }) });
        case vehicleChecksActions.SHOW_ME_QUESTION_SERIOUS_FAULT:
            return __assign(__assign({}, state), { showMeQuestion: __assign(__assign({}, state.showMeQuestion), { outcome: CompetencyOutcome.S }) });
        case vehicleChecksActions.SHOW_ME_QUESTION_DANGEROUS_FAULT:
            return __assign(__assign({}, state), { showMeQuestion: __assign(__assign({}, state.showMeQuestion), { outcome: CompetencyOutcome.D }) });
        case vehicleChecksActions.SHOW_ME_QUESTION_DRIVING_FAULT:
            return __assign(__assign({}, state), { showMeQuestion: __assign(__assign({}, state.showMeQuestion), { outcome: CompetencyOutcome.DF }) });
        case vehicleChecksActions.SHOW_ME_QUESTION_REMOVE_FAULT:
            var _a = state.showMeQuestion, outcome = _a.outcome, notOutcome = __rest(_a, ["outcome"]);
            return __assign(__assign({}, state), { showMeQuestion: __assign({}, notOutcome) });
        case vehicleChecksActions.ADD_SHOW_ME_TELL_ME_COMMENT:
            return __assign(__assign({}, state), { showMeTellMeComments: action.comment });
        default:
            return state;
    }
}
//# sourceMappingURL=vehicle-checks.reducer.js.map
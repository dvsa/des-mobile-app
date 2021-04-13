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
import * as testRequirementsActions from '../../common/test-requirements/test-requirements.actions';
import { createFeatureSelector } from '@ngrx/store';
export var initialState = {};
export function testRequirementsReducer(state, action) {
    var _a;
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case testRequirementsActions.TOGGLE_LEGAL_REQUIREMENT:
            return __assign(__assign({}, state), (_a = {}, _a[action.payload] = !state[action.payload], _a));
        default:
            return state;
    }
}
export var getTestRequirementsCatB = createFeatureSelector('testRequirements');
//# sourceMappingURL=test-requirements.reducer.js.map
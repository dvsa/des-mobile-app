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
import * as manoeuvresActions from '../../common/manoeuvres/manoeuvres.actions';
import { CompetencyOutcome } from '../../../../../shared/models/competency-outcome';
export var initialState = {};
export function manoeuvresReducer(state, action) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case manoeuvresActions.RECORD_MANOEUVRES_SELECTION:
            return _a = {},
                _a[action.manoeuvre] = __assign(__assign({}, state[action.manoeuvre]), { selected: true }),
                _a;
        case manoeuvresActions.ADD_MANOEUVRE_DRIVING_FAULT:
            return __assign(__assign({}, state), (_b = {}, _b[action.payload.manoeuvre] = __assign(__assign({}, state[action.payload.manoeuvre]), (_c = {}, _c[action.payload.competency] = CompetencyOutcome.DF, _c)), _b));
        case manoeuvresActions.ADD_MANOEUVRE_COMMENT:
            return __assign(__assign({}, state), (_d = {}, _d[action.fieldName] = __assign(__assign({}, state[action.fieldName]), (_e = {}, _e[action.controlOrObservation.toLocaleLowerCase() + "FaultComments"] = action.comment, _e)), _d));
        case manoeuvresActions.ADD_MANOEUVRE_SERIOUS_FAULT:
            return __assign(__assign({}, state), (_f = {}, _f[action.payload.manoeuvre] = __assign(__assign({}, state[action.payload.manoeuvre]), (_g = {}, _g[action.payload.competency] = CompetencyOutcome.S, _g)), _f));
        case manoeuvresActions.ADD_MANOEUVRE_DANGEROUS_FAULT:
            return __assign(__assign({}, state), (_h = {}, _h[action.payload.manoeuvre] = __assign(__assign({}, state[action.payload.manoeuvre]), (_j = {}, _j[action.payload.competency] = CompetencyOutcome.D, _j)), _h));
        case manoeuvresActions.REMOVE_MANOEUVRE_FAULT:
            var _l = state[action.payload.manoeuvre], _m = action.payload.competency, competencyToOmit = _l[_m], stateToPreserve = __rest(_l, [typeof _m === "symbol" ? _m : _m + ""]);
            return __assign(__assign({}, state), (_k = {}, _k[action.payload.manoeuvre] = stateToPreserve, _k));
        default:
            return state;
    }
}
//# sourceMappingURL=manoeuvres.reducer.js.map
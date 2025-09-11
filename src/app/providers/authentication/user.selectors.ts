import { createSelector } from '@ngrx/store';
import { userFeature } from './user.reducer';

function randomString(length: number, fromRange = 2): string {
  return Math.random()
    .toString(36)
    .slice(fromRange, fromRange + length);
}
const UUID_REGEX = /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/g;

const UUID_REGEX_SUB = /^[0-9a-fA-F]{4}$/;

const { name, reducer, ...selectors } = userFeature;

const selectTokenInfo = createSelector(userFeature.selectTokenInfo, (tokenInfo) => tokenInfo);

const selectAuthResult = createSelector(selectTokenInfo, (tokenInfo) => tokenInfo?.authResult);

const selectTesterID = createSelector(selectTokenInfo, (tokenInfo) => tokenInfo?.employeeId || tokenInfo?.oid || null);

const selectEmployeeID = createSelector(selectTokenInfo, (tokenInfo) => tokenInfo?.employeeId);

const selectOID = createSelector(selectTokenInfo, (tokenInfo) => tokenInfo?.oid);

// const selectRoles = createSelector(selectTokenInfo, (tokenInfo) => tokenInfo?.testerRoles);
//
// const selectTesterName = createSelector(selectTokenInfo, (tokenInfo) => tokenInfo?.testerName);
//
// const selectTesterEmail = createSelector(selectTokenInfo, (tokenInfo) => tokenInfo?.testerEmail);

const selectIdToken = createSelector(selectAuthResult, (authResult) => authResult?.idToken);

const selectAccessToken = createSelector(selectAuthResult, (authResult) => authResult?.accessToken);

const selectObfuscatedTesterOid = createSelector(selectOID, (id) => {
  const oid = id || randomString(9);

  let obfuscated = '';
  let obfuscatedCollection = [];

  if (oid.match(UUID_REGEX)) {
    obfuscatedCollection = oid.split('-').map((portion) => {
      if (portion.match(UUID_REGEX_SUB)) {
        return '****';
      }
      return portion;
    });
    obfuscated = obfuscatedCollection.join('-');
  }

  return obfuscated;
});

// const selectHasRequiredRoles = (requiredRoles: string[]) =>
//   createSelector(selectRoles, (roles) => {
//     return roles?.some((role) => requiredRoles.includes(role));
//   });

export const UserSelectors = {
  ...selectors,
  selectTesterID,
  selectEmployeeID,
  // selectRoles,
  selectOID,
  // selectTesterName,
  // selectTesterEmail,
  selectObfuscatedTesterOid,
  selectAuthResult,
  selectIdToken,
  selectAccessToken,
  // selectHasRequiredRoles,
};

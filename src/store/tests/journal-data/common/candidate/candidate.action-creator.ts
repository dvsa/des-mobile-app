import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Booking } from '@dvsa/mes-journal-schema';
import { get } from 'lodash';
import { PopulateCandidateDetails } from './candidate.actions';
import { PopulateCandidateDetailsCatBE } from '../../cat-be/candidate/candidate.cat-be.actions';
import { PopulateCandidateDetailsCatC } from '../../cat-c/candidate/candidate.cat-c.actions';
import { PopulateCandidateDetailsCatD } from '../../cat-d/candidate/candidate.cat-d.actions';
import { PopulateCandidateDetailsCatHome } from '../../cat-home/candidate/candidate.cat-home.actions';
import { PopulateCandidateDetailsCatManoeuvre } from '../../cat-manoeuvre/candidate/candidate.cat-manoeuvre.actions';

type CandidateDetailsUnion =
  ReturnType<typeof PopulateCandidateDetails> |
  ReturnType<typeof PopulateCandidateDetailsCatBE> |
  ReturnType<typeof PopulateCandidateDetailsCatC> |
  ReturnType<typeof PopulateCandidateDetailsCatD> |
  ReturnType<typeof PopulateCandidateDetailsCatManoeuvre> |
  ReturnType<typeof PopulateCandidateDetailsCatHome>;

export const createPopulateCandidateDetailsAction = (
  testCategory: string,
  booking: Booking,
): CandidateDetailsUnion => {
  switch (testCategory) {
    case TestCategory.SC:
    case TestCategory.ADI2:
    case TestCategory.ADI3:
    case TestCategory.B:
    case TestCategory.EUAMM1:
    case TestCategory.EUA1M1:
    case TestCategory.EUA2M1:
    case TestCategory.EUAM1:
    case TestCategory.EUAMM2:
    case TestCategory.EUA1M2:
    case TestCategory.EUA2M2:
    case TestCategory.EUAM2:
    case TestCategory.CCPC:
    case TestCategory.DCPC:
      return PopulateCandidateDetails(booking.candidate);
    case TestCategory.BE:
      return PopulateCandidateDetailsCatBE({
        ...booking.candidate,
        businessAddress: get(booking, 'business.businessAddress'),
        businessName: get(booking, 'business.businessName'),
        businessTelephone: get(booking, 'business.telephone'),
      });
    case TestCategory.C1E:
    case TestCategory.CE:
    case TestCategory.C1:
    case TestCategory.C:
      return PopulateCandidateDetailsCatC({
        ...booking.candidate,
        businessAddress: get(booking, 'business.businessAddress'),
        businessName: get(booking, 'business.businessName'),
        businessTelephone: get(booking, 'business.telephone'),
      });
    case TestCategory.C1EM:
    case TestCategory.CEM:
    case TestCategory.C1M:
    case TestCategory.CM:
    case TestCategory.DM:
    case TestCategory.D1M:
    case TestCategory.DEM:
    case TestCategory.D1EM:
      return PopulateCandidateDetailsCatManoeuvre({
        ...booking.candidate,
        businessAddress: get(booking, 'business.businessAddress'),
        businessName: get(booking, 'business.businessName'),
        businessTelephone: get(booking, 'business.telephone'),
      });
    case TestCategory.D:
    case TestCategory.D1:
    case TestCategory.D1E:
    case TestCategory.DE:
      return PopulateCandidateDetailsCatD({
        ...booking.candidate,
        businessAddress: get(booking, 'business.businessAddress'),
        businessName: get(booking, 'business.businessName'),
        businessTelephone: get(booking, 'business.telephone'),
      });
    case TestCategory.F:
    case TestCategory.G:
    case TestCategory.H:
    case TestCategory.K:
      return PopulateCandidateDetailsCatHome({
        ...booking.candidate,
        businessAddress: get(booking, 'business.businessAddress'),
        businessName: get(booking, 'business.businessName'),
        businessTelephone: get(booking, 'business.telephone'),
      });
    default:
      throw new Error('No testCategory has been defined');
  }
};

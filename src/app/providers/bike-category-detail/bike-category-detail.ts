import { Injectable } from '@angular/core';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import bikeCategoryDetails from '@shared/constants/bike-category-details/bike-category-details';
import { BikeCategoryDetail, BikeTestType } from './bike-category-detail.model';

@Injectable()
export class BikeCategoryDetailProvider {
	public getDetailByCategoryCode(category: CategoryCode): BikeCategoryDetail {
		return bikeCategoryDetails.find((item) => item.categoryCode === category);
	}

	public getAllDetailsByTestType(testType: BikeTestType): BikeCategoryDetail[] {
		return bikeCategoryDetails.filter((bikeDetail) => bikeDetail.testType === testType);
	}
}

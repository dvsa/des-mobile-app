import { Injectable } from '@angular/core';
import { SearchProvider } from '@providers/search/search';
import { CompressionProvider } from '@providers/compression/compression';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { CallBackendRecords } from '@pages/examiner-records/examiner-records.actions';
import { selectExaminerRecords } from '@store/app-info/app-info.selectors';


@Injectable()
export class ExaminerRecordsProvider {

  constructor(
    public searchProvider: SearchProvider,
    public compressionProvider: CompressionProvider,
    public store$: Store<StoreModel>,
  ) {
  }
  async cacheOnlineRecords() {
    console.log('before cacheCall');
    this.store$.dispatch(CallBackendRecords('55555555'));
    console.log('online:', this.store$.selectSignal(selectExaminerRecords)());
  }

}

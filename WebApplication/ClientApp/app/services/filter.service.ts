import { Injectable }       from '@angular/core';
import { BehaviorSubject }  from 'rxjs';
import { FilterModel }      from '../library/filter-model';
import { ProdOrder }      from '../library/prod-order.lib';

@Injectable()
export class FilterService{
    public filter = new BehaviorSubject<FilterModel>(new FilterModel);
}
import { Injectable }       from '@angular/core';
import { BehaviorSubject }  from 'rxjs';
import { FilterModel }      from '../library/filter-model';
import { ProdOrder }      from '../library/prod-order.lib';

@Injectable()
export class FilterService{
    public filter = new BehaviorSubject<FilterModel>(new FilterModel);

    public applyFilter(filt: any, order: any) {
        let allow = true;

        if (filt.planner_filter != '') {
            if (filt.planner_filter !== order.planner_maintenance) {
                allow = false;
            }
        }

        if (allow && filt.org_filter != '') {
            if (filt.org_filter !== order.organization_id) {
                allow = false;
            } else {
                if (filt.agr_filter != '') {
                    if (filt.agr_filter !== order.instance_number) {
                        allow = false;
                    } else {
                        if (filt.wt_filter != '') {
                            let sup = order.work_type.split(":");
                            if (filt.wt_filter !== sup[0]) {
                                allow = false;
                            }
                        }
                    }
                }
            }
        }

        return allow;
    }

}
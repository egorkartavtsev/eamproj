import { Injectable }       from '@angular/core';
import { BehaviorSubject }  from 'rxjs';
import { FilterModel }      from '../library/filter-model';
import { ProdOrder }      from '../library/prod-order.lib';

@Injectable()
export class FilterService{
    public filter = new BehaviorSubject<FilterModel>(new FilterModel);

    public makeSQLFilter(filt: FilterModel) {
        let SQLFilt = {};
        let date = new Date(parseInt(filt.period.year), (parseInt(filt.period.month) - 1), parseInt(filt.period.day));
        let tmpD = new Date;
        let monS = '';
        let monE = '';
        let dayS = '';
        let dayE = '';
        let sup = '';
        //dates
        switch (filt.form) {
            case 'year':
                tmpD.setFullYear(date.getFullYear() + 1);
                monS = monE = '01';
                dayS = dayE = '01';
                break;
            case 'mon':
                tmpD.setMonth(date.getMonth() + 1);
                monS = filt.period.month;
                monE = ((tmpD.getMonth() + 1).toString().length > 1) ? (tmpD.getMonth() + 1).toString() : '0' + (tmpD.getMonth() + 1).toString();
                dayE = dayS = '01';
                break;
            case 'week':
                tmpD.setDate(date.getDate() + 7);
                monS = filt.period.month;
                monE = ((tmpD.getMonth() + 1).toString().length > 1) ? (tmpD.getMonth() + 1).toString() : '0' + (tmpD.getMonth() + 1).toString();
                dayS = filt.period.day;
                dayE = (tmpD.getDate().toString().length > 1) ? tmpD.getDate().toString() : '0' + tmpD.getDate().toString();
                break;
        }
        SQLFilt['perStart'] = filt.period.year + '-' + monS + '-' + dayS;
        SQLFilt['perEnd'] = tmpD.getFullYear().toString() + '-' + monE + '-' + dayE;

        //Multiselect
        if (filt.org.length === 0 || filt.org === '%') {
            SQLFilt['org'] = "LIKE '%'"
        } else {
            sup = filt.org.map((a: any) => a.ORGANIZATION_ID).join(', ');
            SQLFilt['orgs'] = "IN ("+sup+")";
        }

        if (filt.agr.length === 0 || filt.agr === '%') {
            SQLFilt['agr'] = "LIKE '%'";
        } else {
            sup = filt.agr.map((a: any) => a.INSTANCE_NUMBER).join("', '");
            SQLFilt['agr'] = "IN ('"+sup+"')";
        }

        if (filt.wtype.length === 0 || filt.wtype === '%') {
            SQLFilt['wtype'] = "LIKE '%'";
        } else {
            sup = filt.wtype.map((a: any) => a.ROUTING_COMMENT).join("', '");
            SQLFilt['wtype'] = "IN ('"+sup+"')";
        }

        if (filt.status.length === 0 || filt.status === '%') {
            SQLFilt['status'] = "LIKE '%'";
        } else {
            sup = filt.status.map((a: any) => a.LOOKUP_CODE).join("', '");
            SQLFilt['status'] = "IN ('" + sup + "')";
        }

        //other
        if (filt.planner === '%') {
            SQLFilt['planner'] = "LIKE '%'";
        } else {
            SQLFilt['planner'] = '= '+filt.planner;
        }

        return SQLFilt;
    }

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
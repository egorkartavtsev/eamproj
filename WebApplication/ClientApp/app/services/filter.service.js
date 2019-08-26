var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilterModel } from '../library/filter-model';
var FilterService = /** @class */ (function () {
    function FilterService() {
        this.filter = new BehaviorSubject(new FilterModel);
    }
    FilterService.prototype.makeSQLFilter = function (filt) {
        var SQLFilt = {};
        var date = new Date(parseInt(filt.period.year), (parseInt(filt.period.month) - 1), parseInt(filt.period.day));
        var tmpD = new Date;
        var monS = '';
        var monE = '';
        var dayS = '';
        var dayE = '';
        var sup = '';
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
        if (filt.filterType === 'custom') {
            if (filt.org.length === 0 || filt.org === '%') {
                SQLFilt['org'] = "LIKE '%'";
            }
            else {
                sup = filt.org.map(function (a) { return a.ORGANIZATION_ID; }).join(', ');
                SQLFilt['org'] = "IN (" + sup + ")";
            }
            if (filt.agr.length === 0 || filt.agr === '%') {
                SQLFilt['agr'] = "LIKE '%'";
            }
            else {
                sup = filt.agr.map(function (a) { return a.INSTANCE_NUMBER; }).join("', '");
                SQLFilt['agr'] = "IN ('" + sup + "')";
            }
            if (filt.wtype.length === 0 || filt.wtype === '%') {
                SQLFilt['wtype'] = "LIKE '%'";
            }
            else {
                sup = filt.wtype.map(function (a) { return a.ROUTING_COMMENT; }).join("', '");
                SQLFilt['wtype'] = "IN ('" + sup + "')";
            }
            if (filt.status.length === 0 || filt.status === '%') {
                SQLFilt['status'] = "LIKE '%'";
            }
            else {
                sup = filt.status.map(function (a) { return a.LOOKUP_CODE; }).join("', '");
                SQLFilt['status'] = "IN ('" + sup + "')";
            }
        }
        else {
            for (var _i = 0, _a = filt.filterLoaded; _i < _a.length; _i++) {
                var field = _a[_i];
                SQLFilt[field.FIELD_NAME] = field.FIELD_VAL;
            }
        }
        //other
        if (filt.planner === '%') {
            SQLFilt['planner'] = "LIKE '%'";
        }
        else {
            SQLFilt['planner'] = '= ' + filt.planner;
        }
        return SQLFilt;
    };
    FilterService.prototype.applyFilter = function (filt, order) {
        var allow = true;
        if (filt.planner_filter != '') {
            if (filt.planner_filter !== order.planner_maintenance) {
                allow = false;
            }
        }
        if (allow && filt.org_filter != '') {
            if (filt.org_filter !== order.organization_id) {
                allow = false;
            }
            else {
                if (filt.agr_filter != '') {
                    if (filt.agr_filter !== order.instance_number) {
                        allow = false;
                    }
                    else {
                        if (filt.wt_filter != '') {
                            var sup = order.work_type.split(":");
                            if (filt.wt_filter !== sup[0]) {
                                allow = false;
                            }
                        }
                    }
                }
            }
        }
        return allow;
    };
    FilterService = __decorate([
        Injectable()
    ], FilterService);
    return FilterService;
}());
export { FilterService };
//# sourceMappingURL=filter.service.js.map
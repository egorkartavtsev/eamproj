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